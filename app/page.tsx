import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RiSupabaseFill } from "react-icons/ri";

export default function Home() {
  return (
    <main 
      className="min-h-[calc(100vh-80px)] flex items-center px-8 py-16 lg:py-24 relative"
      style={{
        backgroundImage: "url('/hero-background.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* 어두운 오버레이로 텍스트 가독성 향상 */}
      <div className="absolute inset-0 bg-black/40 dark:bg-black/60"></div>
      
      {/* 콘텐츠 */}
      <section className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start lg:items-center relative z-10">
        {/* 좌측: 환영 메시지 */}
        <div className="flex flex-col gap-8">
          <h1 className="text-5xl lg:text-7xl font-bold leading-tight text-white drop-shadow-lg">
            SaaS 앱 템플릿에 오신 것을 환영
          </h1>
          <p className="text-xl lg:text-2xl text-white/90 drop-shadow-md leading-relaxed">
            Next.js, Shadcn, Clerk, Supabase, TailwindCSS로 구동되는 완전한
            기능의 템플릿으로 다음 프로젝트를 시작하세요.
          </p>
        </div>

        {/* 우측: 버튼 두 개 세로 정렬 */}
        <div className="flex flex-col gap-6">
          <Link href="/storage-test" className="w-full">
            <Button className="w-full h-28 flex items-center justify-center gap-4 text-xl shadow-lg hover:shadow-xl transition-shadow bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm">
              <RiSupabaseFill className="w-8 h-8" />
              <span>Storage 파일 업로드 테스트</span>
            </Button>
          </Link>
          <Link href="/auth-test" className="w-full">
            <Button
              className="w-full h-28 flex items-center justify-center gap-4 text-xl shadow-lg hover:shadow-xl transition-shadow bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm"
              variant="outline"
            >
              <RiSupabaseFill className="w-8 h-8" />
              <span>Clerk + Supabase 인증 연동</span>
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
