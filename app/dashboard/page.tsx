"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SiteHeader } from "@/components/site-header"
import { RecentPrayers } from "@/components/recent-prayers"
import { WeeklyChallenge } from "@/components/weekly-challenge"
import { useAuth } from "@/contexts/auth-context"
import { supabase } from "@/lib/supabase"

export default function DashboardPage() {
  const { isAuthenticated, isLoading, user } = useAuth()
  const [isClient, setIsClient] = useState(false)
  const [sessionChecked, setSessionChecked] = useState(false)
  const [hasSession, setHasSession] = useState(false)

  // 클라이언트 사이드에서만 실행
  useEffect(() => {
    setIsClient(true)

    // 세션 확인
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession()
      setHasSession(!!data.session)
      setSessionChecked(true)

      if (!data.session) {
        console.log("No session found, redirecting to login")
        window.location.href = "/auth/login?redirect=/dashboard"
      }
    }

    checkSession()
  }, [])

  // 로딩 중이거나 인증되지 않은 경우
  if (!isClient || isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <SiteHeader />
        <main className="flex-1 py-8">
          <div className="container px-4 md:px-6 text-center">
            <p>로딩 중...</p>
          </div>
        </main>
      </div>
    )
  }

  // 세션 확인 후 인증되지 않은 경우
  if (sessionChecked && !hasSession && !isAuthenticated) {
    if (typeof window !== "undefined") {
      window.location.href = "/auth/login?redirect=/dashboard"
    }
    return null
  }

  // 사용자 ID 설정
  const userId = user?.id || "guest"

  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-1 py-8">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-amber-900">대시보드</h1>
              <p className="text-gray-600 mt-1">오늘의 기도와 묵상을 관리하세요.</p>
            </div>
            <div className="flex space-x-3 mt-4 md:mt-0">
              <Button asChild className="bg-amber-600 hover:bg-amber-700">
                <Link href="/prayers/new">
                  <Plus className="mr-2 h-4 w-4" />새 기도 작성
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-amber-200 text-amber-800 hover:bg-amber-100">
                <Link href="/meditations/new">
                  <Plus className="mr-2 h-4 w-4" />새 묵상 작성
                </Link>
              </Button>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="md:col-span-2">
              <Card className="border-amber-200">
                <CardHeader>
                  <CardTitle className="text-amber-900">최근 기도</CardTitle>
                  <CardDescription>최근에 작성한 기도 목록입니다.</CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentPrayers userId={userId} />
                </CardContent>
              </Card>
            </div>
            <div>
              <Card className="border-amber-200">
                <CardHeader>
                  <CardTitle className="text-amber-900">주간 도전</CardTitle>
                  <CardDescription>이번 주 기도 도전에 참여하세요.</CardDescription>
                </CardHeader>
                <CardContent>
                  <WeeklyChallenge />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
