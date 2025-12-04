# Clerk + Supabase 통합 가이드

이 문서는 Clerk와 Supabase를 최신 모범 사례에 따라 통합하는 방법을 설명합니다.

## 📋 목차

1. [개요](#개요)
2. [사전 준비](#사전-준비)
3. [Supabase 설정](#supabase-설정)
4. [Clerk 설정](#clerk-설정)
5. [코드 구현](#코드-구현)
6. [환경 변수 설정](#환경-변수-설정)
7. [테스트](#테스트)
8. [주의사항](#주의사항)

## 개요

### 통합 방식의 변화

**2025년 4월 1일부터 변경사항:**
- ❌ **Deprecated**: Clerk Supabase JWT 템플릿 (더 이상 사용하지 않음)
- ✅ **권장**: Clerk + Supabase 네이티브 통합 (현재 방식)

### 네이티브 통합의 장점

1. **간편함**: 각 Supabase 요청마다 새 토큰을 가져올 필요 없음
2. **보안**: Supabase JWT 시크릿 키를 Clerk와 공유할 필요 없음
3. **자동화**: Clerk 세션 토큰이 자동으로 Supabase에서 검증됨

## 사전 준비

### 필요한 계정

1. **Clerk 계정**: [https://dashboard.clerk.com](https://dashboard.clerk.com)
2. **Supabase 계정**: [https://supabase.com](https://supabase.com)

### 필요한 패키지

이미 설치되어 있어야 합니다:

```json
{
  "@clerk/nextjs": "^6.35.6",
  "@supabase/supabase-js": "^2.49.8"
}
```

## Supabase 설정

### 1단계: Supabase 프로젝트 생성

1. [Supabase Dashboard](https://supabase.com/dashboard)에 로그인
2. **New Project** 클릭
3. 프로젝트 정보 입력 후 생성

### 2단계: API 키 확인

1. Supabase Dashboard에서 **Settings** > **API** 이동
2. 다음 정보를 복사해두세요:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** 키 → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** 키 → `SUPABASE_SERVICE_ROLE_KEY` (서버 사이드 전용)

### 3단계: Clerk를 Third-Party Auth Provider로 추가

1. Supabase Dashboard에서 **Authentication** > **Sign In / Up** 이동
2. **Third Party Auth** 탭 선택
3. **Add provider** 클릭
4. **Clerk** 선택
5. 팝업에서 **Clerk's Connect with Supabase page** 링크 클릭
   - 또는 직접 [Clerk Dashboard의 Supabase 통합 페이지](https://dashboard.clerk.com/setup/supabase)로 이동
6. Clerk Dashboard에서:
   - 통합을 활성화할 Clerk 인스턴스 선택
   - **Activate Supabase integration** 클릭
   - 표시된 **Clerk domain** 복사
7. Supabase Dashboard로 돌아와서:
   - 복사한 **Clerk domain** 붙여넣기
   - **Create connection** 클릭

✅ 이제 Clerk가 Supabase의 third-party auth provider로 설정되었습니다!

## Clerk 설정

### Clerk Supabase 통합 활성화

1. [Clerk Dashboard](https://dashboard.clerk.com)에 로그인
2. **Setup** > **Supabase** 이동
3. **Activate Supabase integration** 클릭
4. 표시된 **Clerk domain**을 복사하여 Supabase에 입력 (위 3단계 참조)

### Clerk 세션 토큰 설정

Clerk는 자동으로 세션 토큰에 `"role": "authenticated"` 클레임을 추가합니다. 이는 Supabase가 인증된 사용자를 인식하는 데 필요합니다.

## 코드 구현

### 클라이언트 컴포넌트용 (Client Component)

**파일**: `lib/supabase/clerk-client.ts`

```typescript
"use client";

import { createClient } from "@supabase/supabase-js";
import { useSession } from "@clerk/nextjs";
import { useMemo } from "react";

export function useClerkSupabaseClient() {
  const { session } = useSession();

  const supabase = useMemo(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    return createClient(supabaseUrl, supabaseKey, {
      async accessToken() {
        return (await session?.getToken()) ?? null;
      },
    });
  }, [session]);

  return supabase;
}
```

**사용 예시**:

```tsx
"use client";

import { useClerkSupabaseClient } from "@/lib/supabase/clerk-client";

export default function MyComponent() {
  const supabase = useClerkSupabaseClient();

  async function fetchData() {
    const { data, error } = await supabase
      .from("tasks")
      .select("*");
    
    if (error) {
      console.error("Error:", error);
      return;
    }
    
    return data;
  }

  return <div>...</div>;
}
```

### 서버 컴포넌트용 (Server Component)

**파일**: `lib/supabase/server.ts`

```typescript
import { createClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server";

export function createClerkSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  return createClient(supabaseUrl, supabaseKey, {
    async accessToken() {
      return (await auth()).getToken();
    },
  });
}
```

**사용 예시**:

```tsx
import { createClerkSupabaseClient } from "@/lib/supabase/server";

export default async function MyPage() {
  const supabase = createClerkSupabaseClient();
  
  const { data, error } = await supabase
    .from("tasks")
    .select("*");
  
  if (error) {
    throw error;
  }
  
  return (
    <div>
      {data?.map((task) => (
        <div key={task.id}>{task.name}</div>
      ))}
    </div>
  );
}
```

### Server Actions용

Server Actions에서도 서버 컴포넌트용 클라이언트를 사용할 수 있습니다:

```typescript
"use server";

import { createClerkSupabaseClient } from "@/lib/supabase/server";

export async function addTask(name: string) {
  const supabase = createClerkSupabaseClient();
  
  const { data, error } = await supabase
    .from("tasks")
    .insert({ name });
  
  if (error) {
    throw new Error(`Failed to add task: ${error.message}`);
  }
  
  return data;
}
```

## 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 변수들을 추가하세요:

```bash
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (서버 전용)
```

⚠️ **중요**: 
- `NEXT_PUBLIC_` 접두사가 붙은 변수는 클라이언트에서도 접근 가능합니다
- `SUPABASE_SERVICE_ROLE_KEY`는 절대 클라이언트에 노출되면 안 됩니다

## 테스트

### 1. 통합 테스트 페이지

프로젝트에 포함된 `/integration-test` 페이지에서 다음을 테스트할 수 있습니다:

1. **서버 컴포넌트 테스트**
   - 서버 사이드에서 Supabase 클라이언트 사용
   - 인증 상태 확인
   - 데이터 조회

2. **클라이언트 컴포넌트 테스트**
   - 클라이언트 사이드에서 Supabase 클라이언트 사용
   - 실시간 데이터 조회 및 추가

3. **Server Action 테스트**
   - Server Action에서 Supabase 클라이언트 사용
   - 데이터 추가 작업

### 2. 기존 테스트 페이지

`/auth-test` 페이지에서 다음을 확인할 수 있습니다:

1. Clerk 인증 상태
2. Supabase 연결 상태
3. 사용자 데이터 동기화

### 3. 수동 테스트

```typescript
// 클라이언트 컴포넌트에서
const supabase = useClerkSupabaseClient();
const { data, error } = await supabase.from("users").select("*");

// 서버 컴포넌트에서
const supabase = createClerkSupabaseClient();
const { data, error } = await supabase.from("users").select("*");
```

### 3. RLS 정책 테스트

개발 중에는 RLS가 비활성화되어 있지만, 프로덕션에서는 다음처럼 RLS 정책을 설정해야 합니다:

```sql
-- 예시: 사용자가 자신의 데이터만 조회할 수 있도록
CREATE POLICY "Users can view their own data"
ON public.tasks
FOR SELECT
USING (auth.jwt()->>'sub' = user_id);
```

## 주의사항

### 1. RLS (Row Level Security)

- **개발 중**: RLS를 비활성화하여 개발 편의성 확보
- **프로덕션**: 반드시 적절한 RLS 정책 설정 필요

### 2. 사용자 동기화

이 통합은 **인증**만 처리합니다. Clerk 사용자 정보를 Supabase 데이터베이스에 저장하려면:

- **Webhook 사용**: Clerk에서 사용자 생성/업데이트 이벤트를 받아 Supabase에 동기화
- **수동 동기화**: 로그인 시 API를 통해 수동으로 동기화 (현재 `sync-user` API 사용)

### 3. 토큰 갱신

Clerk 세션 토큰은 자동으로 갱신됩니다. `accessToken()` 함수가 호출될 때마다 최신 토큰을 반환합니다.

### 4. 에러 처리

Supabase 요청 시 에러가 발생하면:

```typescript
const { data, error } = await supabase.from("table").select("*");

if (error) {
  // 인증 에러인 경우
  if (error.code === "PGRST301" || error.message.includes("JWT")) {
    console.error("Authentication error:", error);
    // 사용자를 로그인 페이지로 리다이렉트
  } else {
    console.error("Database error:", error);
  }
}
```

## 참고 자료

- [Clerk Supabase 통합 공식 문서](https://clerk.com/docs/guides/development/integrations/databases/supabase)
- [Supabase Third-Party Auth 가이드](https://supabase.com/docs/guides/auth/third-party/clerk)
- [Clerk Next.js 문서](https://clerk.com/docs/reference/nextjs/overview)
- [Supabase JavaScript 클라이언트 문서](https://supabase.com/docs/reference/javascript/introduction)

## 문제 해결

### 문제: "JWT expired" 또는 "Invalid JWT"

**해결 방법**:
1. Clerk와 Supabase 통합이 제대로 설정되었는지 확인
2. Clerk domain이 Supabase에 올바르게 입력되었는지 확인
3. 환경 변수가 올바르게 설정되었는지 확인

### 문제: RLS 정책으로 인한 접근 거부

**해결 방법**:
1. 개발 중: RLS 비활성화 (`ALTER TABLE table_name DISABLE ROW LEVEL SECURITY;`)
2. 프로덕션: 적절한 RLS 정책 설정

### 문제: 세션 토큰이 null

**해결 방법**:
1. 사용자가 로그인되어 있는지 확인
2. `useSession()` 또는 `auth()`가 올바르게 호출되는지 확인
3. Clerk 미들웨어가 올바르게 설정되었는지 확인

