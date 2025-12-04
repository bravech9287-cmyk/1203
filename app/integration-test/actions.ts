/**
 * @file integration-test/actions.ts
 * @description Server Actions - Supabase 클라이언트 사용 예제
 */

"use server";

import { createClerkSupabaseClient } from "@/lib/supabase/server";
import { auth } from "@clerk/nextjs/server";

export async function addTask(name: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("인증이 필요합니다.");
  }

  const supabase = createClerkSupabaseClient();

  const { data, error } = await supabase
    .from("tasks")
    .insert({
      user_id: userId,
      name,
    })
    .select()
    .single();

  if (error) {
    console.error("Supabase error:", error);
    throw new Error(`작업 추가 실패: ${error.message}`);
  }

  return data;
}


