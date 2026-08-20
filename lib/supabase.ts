import { createClient } from "@supabase/supabase-js"
import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

// 클라이언트 모듈이 서버 빌드 중 평가될 수 있으므로 안전한 개발용 기본값을 사용합니다.
// 실제 브라우저 요청에서는 NEXT_PUBLIC_SUPABASE_URL과 NEXT_PUBLIC_SUPABASE_ANON_KEY를 설정해야 합니다.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "http://localhost:54321"
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "development-anon-key"

// 브라우저 환경에서만 싱글톤 인스턴스 생성
let supabaseInstance: SupabaseClient<Database> | null = null

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
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "http://localhost:54321",
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? "development-service-role-key",
    {
    auth: {
      persistSession: false,
    },
  })
}
