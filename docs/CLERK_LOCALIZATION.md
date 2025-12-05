# Clerk 한국어 로컬라이제이션 가이드

이 문서는 Clerk 컴포넌트를 한국어로 설정하는 방법을 설명합니다.

## 📋 목차

1. [개요](#개요)
2. [기본 설정](#기본-설정)
3. [커스텀 로컬라이제이션](#커스텀-로컬라이제이션)
4. [에러 메시지 커스터마이징](#에러-메시지-커스터마이징)
5. [참고 자료](#참고-자료)

## 개요

Clerk는 `@clerk/localizations` 패키지를 통해 다양한 언어를 지원합니다. 프로젝트에서는 한국어(`koKR`) 로컬라이제이션이 적용되어 있습니다.

### 지원되는 언어

Clerk는 다음 언어를 지원합니다:
- 한국어 (ko-KR) ✅ **현재 사용 중**
- 영어 (en-US, en-GB)
- 일본어 (ja-JP)
- 중국어 (zh-CN, zh-TW)
- 기타 50개 이상의 언어

전체 목록은 [Clerk 공식 문서](https://clerk.com/docs/guides/customizing-clerk/localization)를 참고하세요.

## 기본 설정

### 1. 패키지 설치

프로젝트에 이미 설치되어 있습니다:

```json
{
  "dependencies": {
    "@clerk/localizations": "^3.26.3"
  }
}
```

### 2. 로컬라이제이션 적용

`app/layout.tsx`에서 한국어 로컬라이제이션이 적용되어 있습니다:

```tsx
import { ClerkProvider } from "@clerk/nextjs";
import { clerkLocalization } from "@/lib/clerk-localization";

export default function RootLayout({ children }) {
  return (
    <ClerkProvider localization={clerkLocalization}>
      <html lang="ko">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
```

### 3. 로컬라이제이션 파일

로컬라이제이션 설정은 `lib/clerk-localization.ts`에서 관리합니다:

```typescript
import { koKR } from "@clerk/localizations";

export const clerkLocalization = {
  ...koKR,
  // 필요시 커스텀 설정 추가 가능
};
```

## 커스텀 로컬라이제이션

특정 텍스트를 커스터마이징하려면 `lib/clerk-localization.ts` 파일을 수정하세요.

### 예시: 버튼 텍스트 변경

```typescript
import { koKR } from "@clerk/localizations";

export const clerkLocalization = {
  ...koKR,
  formButtonPrimary: "시작하기",
  formButtonSecondary: "취소",
};
```

### 예시: 회원가입/로그인 서브타이틀 변경

```typescript
import { koKR } from "@clerk/localizations";

export const clerkLocalization = {
  ...koKR,
  signUp: {
    start: {
      subtitle: "{{applicationName}}에 가입하세요",
    },
    emailCode: {
      subtitle: "{{applicationName}}에 가입하세요",
    },
  },
  signIn: {
    start: {
      subtitle: "{{applicationName}}에 로그인하세요",
    },
  },
};
```

### 커스터마이징 가능한 항목

다음과 같은 항목들을 커스터마이징할 수 있습니다:

- **폼 버튼**: `formButtonPrimary`, `formButtonSecondary`
- **회원가입**: `signUp.start.subtitle`, `signUp.emailCode.subtitle` 등
- **로그인**: `signIn.start.subtitle`, `signIn.emailCode.subtitle` 등
- **프로필**: `profilePage.title`, `profilePage.description` 등
- **에러 메시지**: `unstable__errors` 객체 내의 모든 에러 키

전체 목록은 [Clerk 로컬라이제이션 타입 정의](https://github.com/clerk/javascript/blob/main/packages/localizations/src/locales/koKR.ts)를 참고하세요.

## 에러 메시지 커스터마이징

특정 에러 메시지를 커스터마이징하려면 `unstable__errors` 객체를 사용하세요:

```typescript
import { koKR } from "@clerk/localizations";

export const clerkLocalization = {
  ...koKR,
  unstable__errors: {
    ...koKR.unstable__errors,
    not_allowed_access:
      "접근이 허용되지 않습니다. 관리자에게 문의하세요.",
    form_identifier_not_found:
      "등록되지 않은 이메일입니다. 회원가입을 먼저 진행해주세요.",
    form_password_pwned:
      "이 비밀번호는 보안상 위험합니다. 다른 비밀번호를 사용해주세요.",
  },
};
```

### 주요 에러 키

- `not_allowed_access`: 허용되지 않은 도메인으로 접근 시도
- `form_identifier_not_found`: 등록되지 않은 이메일/전화번호
- `form_password_pwned`: 유출된 비밀번호 사용
- `form_password_length_too_short`: 비밀번호 길이 부족
- `form_username_invalid_length`: 사용자명 길이 오류

## 테스트

### 1. 로컬 개발 서버 실행

```bash
pnpm dev
```

### 2. Clerk 컴포넌트 확인

다음 컴포넌트들이 한국어로 표시되는지 확인하세요:

- **SignInButton**: 로그인 버튼 클릭 시 모달
- **SignUpButton**: 회원가입 버튼 클릭 시 모달
- **UserButton**: 사용자 프로필 버튼
- **SignIn**, **SignUp** 컴포넌트

### 3. 테스트 페이지

- `/auth-test`: Clerk 인증 테스트 페이지
- `/integration-test`: Clerk + Supabase 통합 테스트 페이지

## 주의사항

### 1. Account Portal은 영어로 유지됨

> ⚠️ **중요**: 로컬라이제이션은 Clerk 컴포넌트의 텍스트만 변경합니다. 
> Clerk의 호스팅된 [Account Portal](https://clerk.com/docs/guides/customizing-clerk/account-portal)은 여전히 영어로 표시됩니다.

### 2. 실험적 기능

로컬라이제이션 기능은 현재 실험적(experimental) 기능입니다. 문제가 발생하면 [Clerk 지원팀](https://clerk.com/contact/support)에 문의하세요.

### 3. 타입 안정성

TypeScript를 사용하는 경우, 커스텀 로컬라이제이션 객체의 타입이 올바른지 확인하세요. 잘못된 키를 사용하면 타입 에러가 발생할 수 있습니다.

## 참고 자료

- [Clerk 로컬라이제이션 공식 문서](https://clerk.com/docs/guides/customizing-clerk/localization)
- [@clerk/localizations 패키지](https://www.npmjs.com/package/@clerk/localizations)
- [Clerk 한국어 로컬라이제이션 소스 코드](https://github.com/clerk/javascript/tree/main/packages/localizations/src/locales)

## 문제 해결

### 문제: 한국어가 적용되지 않음

**해결 방법**:
1. `@clerk/localizations` 패키지가 설치되어 있는지 확인
2. `app/layout.tsx`에서 `ClerkProvider`에 `localization` prop이 전달되는지 확인
3. 브라우저 캐시를 지우고 새로고침

### 문제: 특정 텍스트만 변경하고 싶음

**해결 방법**:
1. `lib/clerk-localization.ts` 파일 열기
2. `koKR`을 스프레드하고 필요한 키만 오버라이드
3. 예시:
   ```typescript
   export const clerkLocalization = {
     ...koKR,
     formButtonPrimary: "내가 원하는 텍스트",
   };
   ```

### 문제: 타입 에러 발생

**해결 방법**:
1. `@clerk/localizations` 패키지 버전 확인
2. TypeScript 타입 정의 확인
3. 올바른 키 이름 사용 (대소문자 구분)



