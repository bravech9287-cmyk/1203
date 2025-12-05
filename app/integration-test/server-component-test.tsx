/**
 * @file integration-test/server-component-test.tsx
 * @description 서버 컴포넌트에서 Supabase 클라이언트 사용 테스트
 */

import { createClerkSupabaseClient } from "@/lib/supabase/server";
import { auth } from "@clerk/nextjs/server";
import { Button } from "@/components/ui/button";
import AddTaskForm from "./add-task-form";

export default async function ServerComponentTest() {
  const { userId } = await auth();
  const supabase = createClerkSupabaseClient();

  // 사용자 데이터 조회
  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("*")
    .eq("clerk_id", userId || "")
    .single();

  // 테스트용 tasks 테이블이 있다면 조회 (없으면 생성 안내)
  const { data: tasks, error: tasksError } = await supabase
    .from("tasks")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(10);

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">인증 정보</h3>
        <p className="text-sm text-blue-800">
          Clerk User ID: <code className="bg-blue-100 px-2 py-1 rounded">{userId || "없음"}</code>
        </p>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h3 className="font-semibold text-green-900 mb-2">Supabase 연결 상태</h3>
        {userError ? (
          <div className="text-sm text-red-800">
            <p className="font-semibold">에러 발생:</p>
            <p>{userError.message}</p>
            <p className="mt-2 text-xs">
              {userError.code === "PGRST116" && "users 테이블이 없거나 데이터가 없습니다."}
              {userError.code === "PGRST301" && "인증 에러: Clerk 통합이 올바르게 설정되었는지 확인하세요."}
            </p>
          </div>
        ) : (
          <div className="text-sm text-green-800">
            <p className="font-semibold">✅ 연결 성공</p>
            {userData && (
              <div className="mt-2">
                <p>사용자 이름: {userData.name}</p>
                <p>생성일: {new Date(userData.created_at).toLocaleString("ko-KR")}</p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <h3 className="font-semibold text-purple-900 mb-2">Tasks 테스트</h3>
        {tasksError ? (
          <div className="text-sm text-red-800">
            <p className="font-semibold">에러 발생:</p>
            <p>{tasksError.message}</p>
            {tasksError.code === "42P01" && (
              <p className="mt-2 text-xs">
                tasks 테이블이 없습니다. Supabase에서 다음 SQL을 실행하세요:
                <pre className="mt-2 bg-gray-100 p-2 rounded text-xs overflow-x-auto">
                  {`CREATE TABLE IF NOT EXISTS tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE tasks DISABLE ROW LEVEL SECURITY;`}
                </pre>
              </p>
            )}
          </div>
        ) : (
          <div className="text-sm text-purple-800">
            <p className="font-semibold mb-2">Tasks 목록:</p>
            {tasks && tasks.length > 0 ? (
              <ul className="list-disc list-inside space-y-1">
                {tasks.map((task: any) => (
                  <li key={task.id}>{task.name}</li>
                ))}
              </ul>
            ) : (
              <p>작업이 없습니다.</p>
            )}
            <div className="mt-4">
              <AddTaskForm />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}



