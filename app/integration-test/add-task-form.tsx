/**
 * @file integration-test/add-task-form.tsx
 * @description Server Action을 사용한 Task 추가 폼
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { addTask } from "./actions";

export default function AddTaskForm() {
  const router = useRouter();
  const [taskName, setTaskName] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!taskName.trim()) return;

    setLoading(true);
    try {
      await addTask(taskName.trim());
      setTaskName("");
      router.refresh(); // 서버 컴포넌트 새로고침
    } catch (error) {
      console.error("Failed to add task:", error);
      alert("작업 추가 실패: " + (error instanceof Error ? error.message : "알 수 없는 오류"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={taskName}
        onChange={(e) => setTaskName(e.target.value)}
        placeholder="새 작업 이름 입력..."
        className="flex-1 px-3 py-2 border rounded-md"
        disabled={loading}
      />
      <Button type="submit" disabled={!taskName.trim() || loading}>
        {loading ? "추가 중..." : "추가"}
      </Button>
    </form>
  );
}



