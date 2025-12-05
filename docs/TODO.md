- [ ] `.cursor/` 디렉토리
  - [ ] `rules/` 커서룰
  - [ ] `mcp.json` MCP 서버 설정
  - [ ] `dir.md` 프로젝트 디렉토리 구조
- [ ] `.github/` 디렉토리
- [ ] `.husky/` 디렉토리
- [ ] `app/` 디렉토리
  - [ ] `favicon.ico` 파일
  - [ ] `not-found.tsx` 파일
  - [ ] `robots.ts` 파일
  - [ ] `sitemap.ts` 파일
  - [ ] `manifest.ts` 파일
- [ ] `supabase/` 디렉토리
- [ ] `public/` 디렉토리
  - [ ] `icons/` 디렉토리
  - [ ] `logo.png` 파일
  - [ ] `og-image.png` 파일
- [ ] `tsconfig.json` 파일
- [ ] `.cursorignore` 파일
- [ ] `.gitignore` 파일
- [ ] `.prettierignore` 파일
- [ ] `.prettierrc` 파일
- [ ] `tsconfig.json` 파일
- [ ] `eslint.config.mjs` 파일
- [ ] `AGENTS.md` 파일

- [x] Phase 1: 기본 인프라

  - [x] Next.js 프로젝트 셋업 (pnpm, App Router, React 19)
  - [x] Clerk 연동 (로그인/회원가입, 미들웨어 보호)
  - [x] 기본 레이아웃/네비게이션 구성 (`app/layout.tsx`, `components/Navbar.tsx`)
  - [x] Supabase 프로젝트 연결 및 환경변수 세팅 (`.env.local`)
  - [x] DB 스키마 준비: `products`, `cart_items`, `orders`, `order_items` (개발 환경 RLS 비활성화)
  - [x] 마이그레이션 작성/적용 (`supabase/migrations/*`)

- [x] Phase 2: 상품 기능

  - [x] 홈 페이지: 상품 목록 Grid 레이아웃 구현
    - [x] 히어로 섹션 + 상품 그리드 섹션
    - [x] 반응형 Grid 레이아웃 (모바일/태블릿/데스크톱)
    - [x] 상품 카드 컴포넌트 (이미지, 이름, 가격, 재고 상태, 카테고리 배지)
    - [x] 프로모션 섹션 (추천 상품 섹션)
    - [x] 카테고리별 진입 동선 (네비게이션 바 카테고리 메뉴)
  - [x] 상품 목록 페이지: 페이지네이션/정렬/카테고리 필터
    - [x] 페이지네이션 구현 (페이지당 12개 상품)
    - [x] 정렬 옵션 (최신순, 오래된순, 가격순, 이름순)
    - [x] 카테고리 필터
  - [x] 상품 상세 페이지: 재고/가격/설명 표시 (`/products/[id]`)
    - [x] 상품 상세 정보 표시
    - [x] 404 처리 (not-found 페이지)
  - [x] 어드민 상품 등록은 대시보드에서 수기 관리(문서화만)
    - [x] DB 스키마 준비 완료 (`products` 테이블)
    - [x] 샘플 데이터 포함 (20개 상품)
    - [x] Supabase 대시보드에서 직접 관리 가능

- [x] Phase 3: 장바구니 & 주문

  - [x] 장바구니 담기/삭제/수량 변경 (`cart_items` 연동)
    - [x] 장바구니 타입 정의 및 Server Actions
    - [x] 장바구니 페이지 (목록, 수량 변경, 삭제)
    - [x] 상품 상세 페이지에 장바구니 담기 버튼 추가
    - [x] 네비게이션 바에 장바구니 아이콘 추가
  - [x] 주문 생성 흐름(주소/메모 입력 포함)
    - [x] 주문 타입 정의 및 Server Actions
    - [x] 체크아웃 페이지 (배송지 정보 입력)
    - [x] 주문 완료 페이지
  - [x] 주문테이블 저장(`orders`, `order_items`) 및 합계 검증
    - [x] 주문 생성 시 재고 차감
    - [x] 주문 생성 후 장바구니 비우기
    - [x] 주문 총액 검증

- [x] Phase 4: 결제 통합 (Toss Payments 테스트 모드)

  - [x] 결제위젯 연동 및 클라이언트 플로우 구축
    - [x] Toss Payments 위젯 컴포넌트 생성
    - [x] 결제 페이지 생성 (`/checkout/payment`)
    - [x] 체크아웃 플로우에 결제 단계 추가
  - [x] 결제 성공/실패 콜백 처리
    - [x] 결제 성공 페이지 (`/payment/success`)
    - [x] 결제 실패 페이지 (`/payment/fail`)
  - [x] 결제 완료 후 주문 상태 업데이트(`orders.status`)
    - [x] 결제 승인 Server Action
    - [x] 주문 상태 업데이트 로직

- [x] Phase 5: 마이페이지

  - [x] 주문 내역 목록 조회 (사용자별 `orders`)
    - [x] 주문 내역 페이지 (`/orders`)
    - [x] 주문 목록 컴포넌트
  - [x] 주문 상세 보기 (`order_items` 포함)
    - [x] 주문 상세 페이지 개선 (`/orders/[id]`)
    - [x] 네비게이션 바에 주문 내역 링크 추가

- [ ] Phase 6: 테스트 & 배포

  - [ ] 전체 사용자 플로우 E2E 점검
  - [ ] 주요 버그 수정 및 예외처리 강화
  - [ ] Vercel 배포 설정 및 환경변수 구성

- [ ] 공통 작업 & 문서화

  - [ ] 오류/로딩/비어있는 상태 UI 정비
  - [ ] 타입 안전성 강화 (Zod + react-hook-form 적용 구간)
  - [ ] README/PRD 반영, 운영 가이드 업데이트
  - [ ] 접근성/반응형/다크모드 점검

- [ ] 환경/리포지토리 기초 세팅
  - [ ] `.gitignore` / `.cursorignore` 정비
  - [ ] `eslint.config.mjs` / 포맷터 설정 확정
  - [ ] 아이콘/OG 이미지/파비콘 추가 (`public/`)
  - [ ] SEO 관련 파일 (`robots.ts`, `sitemap.ts`, `manifest.ts`)
