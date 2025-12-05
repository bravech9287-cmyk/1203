# 배포 가이드

이 문서는 Vercel을 사용한 프로덕션 배포 가이드입니다.

## 📋 사전 준비

### 1. Vercel 계정 생성

1. [Vercel](https://vercel.com)에 접속하여 계정 생성
2. GitHub 계정과 연동 (권장)

### 2. 환경 변수 준비

배포 전에 다음 환경 변수들을 준비하세요:

#### Clerk 환경 변수
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `NEXT_PUBLIC_CLERK_SIGN_IN_URL` (기본값: `/sign-in`)
- `NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL` (기본값: `/`)
- `NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL` (기본값: `/`)

#### Supabase 환경 변수
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_STORAGE_BUCKET` (기본값: `uploads`)

#### Toss Payments 환경 변수 (선택사항)
- `NEXT_PUBLIC_TOSS_PAYMENTS_CLIENT_KEY` (테스트 모드 키 사용 가능)

## 🚀 Vercel 배포

### 방법 1: Vercel CLI 사용

```bash
# Vercel CLI 설치 (이미 설치되어 있다면 생략)
pnpm add -g vercel

# 프로젝트 루트에서 배포
vercel

# 프로덕션 배포
vercel --prod
```

### 방법 2: Vercel 대시보드 사용

1. [Vercel Dashboard](https://vercel.com/dashboard)에 로그인
2. **"Add New..."** → **"Project"** 클릭
3. GitHub 저장소 선택 또는 Import
4. 프로젝트 설정:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (기본값)
   - **Build Command**: `pnpm build` (자동 감지)
   - **Output Directory**: `.next` (자동 감지)
   - **Install Command**: `pnpm install` (자동 감지)
5. **Environment Variables** 섹션에서 환경 변수 추가
6. **"Deploy"** 클릭

## 🔧 환경 변수 설정

### Vercel 대시보드에서 설정

1. Vercel Dashboard → 프로젝트 선택
2. **Settings** → **Environment Variables** 이동
3. 다음 환경 변수들을 추가:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key
CLERK_SECRET_KEY=your_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/

NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_STORAGE_BUCKET=uploads

NEXT_PUBLIC_TOSS_PAYMENTS_CLIENT_KEY=your_toss_payments_key
```

4. 각 환경(Production, Preview, Development)에 대해 설정
5. **"Save"** 클릭

### Clerk 리다이렉트 URL 설정

1. Clerk Dashboard → **Settings** → **Paths**
2. **Redirect URLs**에 Vercel 배포 URL 추가:
   - `https://your-project.vercel.app/*`
   - `https://your-custom-domain.com/*` (커스텀 도메인 사용 시)

## 🌐 커스텀 도메인 설정

1. Vercel Dashboard → 프로젝트 선택
2. **Settings** → **Domains** 이동
3. 도메인 추가 및 DNS 설정 안내 따르기

## 🔍 배포 확인

배포가 완료되면 다음을 확인하세요:

1. **홈페이지 접근**: `https://your-project.vercel.app`
2. **로그인/회원가입**: Clerk 인증이 정상 작동하는지 확인
3. **상품 목록**: 상품이 정상적으로 표시되는지 확인
4. **장바구니**: 로그인 후 장바구니 기능 확인
5. **주문 프로세스**: 체크아웃 및 결제 플로우 확인

## 🐛 문제 해결

### 빌드 실패

- 환경 변수가 올바르게 설정되었는지 확인
- `pnpm build` 명령어를 로컬에서 실행하여 에러 확인
- Vercel 빌드 로그 확인

### 환경 변수 관련 에러

- `NEXT_PUBLIC_` 접두사가 있는 변수는 클라이언트에서 접근 가능
- `NEXT_PUBLIC_` 접두사가 없는 변수는 서버 사이드에서만 접근 가능
- 환경 변수 이름이 정확한지 확인

### 인증 관련 에러

- Clerk 리다이렉트 URL이 올바르게 설정되었는지 확인
- Supabase Third-Party Auth Provider 설정 확인

## 📝 추가 참고사항

- Vercel은 자동으로 GitHub 푸시 시 재배포합니다
- Preview 배포는 Pull Request마다 자동 생성됩니다
- 프로덕션 배포는 `main` 브랜치에 푸시 시 자동으로 진행됩니다

