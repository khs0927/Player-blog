import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// 브라우저 환경에서만 싱글톤 인스턴스 생성
let supabaseInstance: ReturnType<typeof createClient> | null = null

export const getSupabaseClient = () => {
  if (!supabaseInstance && typeof window !== "undefined") {
    supabaseInstance = createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        storageKey: "prayer-blog-auth",
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  }

  // 서버 사이드에서는 항상 새 인스턴스 생성
  if (typeof window === "undefined") {
    return createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
      },
    })
  }

  return supabaseInstance!
}

// 기존 supabase 변수를 getSupabaseClient 함수로 대체
export const supabase = getSupabaseClient()

// 서버 컴포넌트용 클라이언트
export const createServerSupabaseClient = () => {
  return createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: {
      persistSession: false,
    },
  })
}
