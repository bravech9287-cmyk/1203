# 메인 페이지 배경 이미지 설정 가이드

메인 페이지에 배경 이미지를 적용하는 방법입니다.

## 이미지 파일 저장

1. 배경으로 사용할 이미지 파일을 준비하세요
2. 이미지 파일을 `public` 폴더에 저장하세요
3. 파일명: `hero-background.jpg` (또는 `.png`, `.webp` 등)

### 권장 사양

- **파일 형식**: JPG, PNG, WebP
- **해상도**: 최소 1920x1080 (Full HD)
- **파일 크기**: 500KB 이하 권장 (최적화된 이미지)
- **비율**: 16:9 또는 21:9 (와이드스크린)

### 파일 위치

```
public/
  └── hero-background.jpg  ← 여기에 이미지 저장
```

## 이미지 최적화 팁

1. **온라인 도구 사용**:
   - [TinyPNG](https://tinypng.com/) - 이미지 압축
   - [Squoosh](https://squoosh.app/) - 이미지 최적화

2. **WebP 형식 사용** (권장):
   - 더 작은 파일 크기
   - 더 나은 품질
   - 파일명: `hero-background.webp`

3. **반응형 이미지**:
   - 모바일용 작은 이미지도 준비 가능
   - 코드에서 조건부로 사용 가능

## 현재 설정

메인 페이지(`app/page.tsx`)는 다음 설정으로 구성되어 있습니다:

- ✅ 배경 이미지: `url('/hero-background.jpg')`
- ✅ 배경 크기: `cover` (전체 화면 커버)
- ✅ 배경 위치: `center` (중앙 정렬)
- ✅ 어두운 오버레이: 텍스트 가독성 향상
- ✅ 반응형 디자인: 모바일/데스크톱 지원

## 다른 이미지 파일명 사용하기

다른 파일명을 사용하려면 `app/page.tsx`의 다음 부분을 수정하세요:

```tsx
style={{
  backgroundImage: "url('/your-image-name.jpg')",  // ← 여기 수정
  // ...
}}
```

## 문제 해결

### 이미지가 표시되지 않음

1. 파일이 `public` 폴더에 있는지 확인
2. 파일명이 정확한지 확인 (대소문자 구분)
3. 브라우저 캐시 삭제 후 새로고침
4. 개발 서버 재시작: `pnpm dev`

### 이미지가 너무 크거나 작음

`app/page.tsx`에서 `backgroundSize`를 조정하세요:

```tsx
backgroundSize: "cover",     // 전체 화면 커버
backgroundSize: "contain",   // 이미지 전체 표시
backgroundSize: "100% 100%", // 강제로 전체 화면
```

### 텍스트가 잘 보이지 않음

오버레이 투명도를 조정하세요:

```tsx
<div className="absolute inset-0 bg-black/40"></div>
//                                 ↑ 숫자 조정 (0-100)
```

- `bg-black/40`: 40% 어두운 오버레이
- `bg-black/60`: 60% 어두운 오버레이 (더 어두움)
- `bg-black/20`: 20% 어두운 오버레이 (더 밝음)



