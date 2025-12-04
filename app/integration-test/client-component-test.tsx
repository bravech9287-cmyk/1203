/**
 * @file integration-test/client-component-test.tsx
 * @description 클라이언트 컴포넌트에서 Supabase 클라이언트 사용 테스트
 */

"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useClerkSupabaseClient } from "@/lib/supabase/clerk-client";
import { Button } from "@/components/ui/button";

interface Task {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
}

export default function ClientComponentTest() {
  const { user } = useUser();
  const supabase = useClerkSupabaseClient();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newTaskName, setNewTaskName] = useState("");

  // Tasks 조회
  const fetchTasks = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10);

      if (fetchError) throw fetchError;
      setTasks(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "데이터 조회 실패");
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Task 추가
  const addTask = async () => {
    if (!user || !newTaskName.trim()) return;

    try {
      const { error: insertError } = await supabase
        .from("tasks")
        .insert({
          user_id: user.id,
          name: newTaskName.trim(),
        });

      if (insertError) throw insertError;

      setNewTaskName("");
      await fetchTasks(); // 목록 새로고침
    } catch (err) {
      setError(err instanceof Error ? err.message : "작업 추가 실패");
      console.error("Insert error:", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [user]);

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">클라이언트 컴포넌트 테스트</h3>
        <p className="text-sm text-blue-800">
          Clerk User ID: <code className="bg-blue-100 px-2 py-1 rounded">{user?.id || "없음"}</code>
        </p>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h3 className="font-semibold text-green-900 mb-2">Tasks 관리</h3>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-800">
            <p className="font-semibold">에러:</p>
            <p>{error}</p>
          </div>
        )}

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newTaskName}
            onChange={(e) => setNewTaskName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTask()}
            placeholder="새 작업 이름 입력..."
            className="flex-1 px-3 py-2 border rounded-md"
          />
          <Button onClick={addTask} disabled={!newTaskName.trim()}>
            추가
          </Button>
        </div>

        {loading ? (
          <p className="text-sm text-gray-600">로딩 중...</p>
        ) : (
          <div>
            {tasks.length > 0 ? (
              <ul className="space-y-2">
                {tasks.map((task) => (
                  <li
                    key={task.id}
                    className="flex items-center justify-between p-2 bg-white border rounded"
                  >
                    <span>{task.name}</span>
                    <span className="text-xs text-gray-500">
                      {new Date(task.created_at).toLocaleString("ko-KR")}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-600">작업이 없습니다.</p>
            )}
          </div>
        )}

        <div className="mt-4">
          <Button variant="outline" onClick={fetchTasks} disabled={loading}>
            새로고침
          </Button>
        </div>
      </div>
    </div>
  );
}


