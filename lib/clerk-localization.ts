/**
 * @file lib/clerk-localization.ts
 * @description Clerk 한국어 로컬라이제이션 설정
 *
 * 이 파일은 Clerk 컴포넌트의 한국어 로컬라이제이션을 관리합니다.
 * 기본 koKR 로컬라이제이션을 사용하며, 필요시 특정 텍스트를 커스터마이징할 수 있습니다.
 *
 * 참고: https://clerk.com/docs/guides/customizing-clerk/localization
 */

import { koKR } from "@clerk/localizations";

/**
 * Clerk 한국어 로컬라이제이션 설정
 *
 * 기본 koKR 로컬라이제이션을 사용하며, 필요시 특정 텍스트를 오버라이드할 수 있습니다.
 *
 * @example
 * ```tsx
 * import { clerkLocalization } from '@/lib/clerk-localization';
 *
 * <ClerkProvider localization={clerkLocalization}>
 *   ...
 * </ClerkProvider>
 * ```
 */
export const clerkLocalization = {
  ...koKR,
  // 필요시 특정 텍스트를 커스터마이징할 수 있습니다
  // 예시:
  // formButtonPrimary: "시작하기",
  // signUp: {
  //   start: {
  //     subtitle: "{{applicationName}}에 가입하세요",
  //   },
  // },
  // signIn: {
  //   start: {
  //     subtitle: "{{applicationName}}에 로그인하세요",
  //   },
  // },
  // 에러 메시지 커스터마이징
  // unstable__errors: {
  //   not_allowed_access: "접근이 허용되지 않습니다. 관리자에게 문의하세요.",
  // },
};



