"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { SiteHeader } from "@/components/site-header"
import { useAuth } from "@/contexts/auth-context"
import { supabase } from "@/lib/supabase"

export default function AuthStatusPage() {
  const { user, session, isAuthenticated, refreshSession } = useAuth()
  const [localSession, setLocalSession] = useState<any>(null)

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession()
      setLocalSession(data.session)
    }

    checkSession()
  }, [])

  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-1 py-8">
        <div className="container px-4 md:px-6 max-w-3xl">
          <h1 className="text-3xl font-bold text-amber-900 mb-6">인증 상태 확인</h1>

          <Card className="border-amber-200 mb-6">
            <CardHeader>
              <CardTitle className="text-amber-900">인증 상태</CardTitle>
              <CardDescription>현재 인증 상태를 확인합니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium">인증 여부:</h3>
                <p>{isAuthenticated ? "로그인됨" : "로그인되지 않음"}</p>
              </div>

              <div>
                <h3 className="font-medium">사용자 정보:</h3>
                {user ? (
                  <pre className="bg-gray-100 p-3 rounded-md overflow-auto text-sm">
                    {JSON.stringify(user, null, 2)}
                  </pre>
                ) : (
                  <p>사용자 정보 없음</p>
                )}
              </div>

              <div>
                <h3 className="font-medium">세션 정보 (Context):</h3>
                {session ? (
                  <pre className="bg-gray-100 p-3 rounded-md overflow-auto text-sm">
                    {JSON.stringify(
                      {
                        id: session.access_token.substring(0, 10) + "...",
                        expires_at: session.expires_at,
                        user_id: session.user.id,
                      },
                      null,
                      2,
                    )}
                  </pre>
                ) : (
                  <p>세션 정보 없음</p>
                )}
              </div>

              <div>
                <h3 className="font-medium">세션 정보 (직접 확인):</h3>
                {localSession ? (
                  <pre className="bg-gray-100 p-3 rounded-md overflow-auto text-sm">
                    {JSON.stringify(
                      {
                        id: localSession.access_token.substring(0, 10) + "...",
                        expires_at: localSession.expires_at,
                        user_id: localSession.user.id,
                      },
                      null,
                      2,
                    )}
                  </pre>
                ) : (
                  <p>세션 정보 없음</p>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                onClick={refreshSession}
                variant="outline"
                className="border-amber-200 text-amber-800 hover:bg-amber-100"
              >
                세션 새로고침
              </Button>

              <Button onClick={() => window.location.reload()} className="bg-amber-600 hover:bg-amber-700">
                페이지 새로고침
              </Button>
            </CardFooter>
          </Card>

          <div className="flex justify-center space-x-4">
            <Button asChild variant="outline" className="border-amber-200 text-amber-800 hover:bg-amber-100">
              <Link href="/">홈으로</Link>
            </Button>

            {isAuthenticated ? (
              <Button asChild className="bg-amber-600 hover:bg-amber-700">
                <Link href="/dashboard">대시보드</Link>
              </Button>
            ) : (
              <Button asChild className="bg-amber-600 hover:bg-amber-700">
                <Link href="/auth/login">로그인</Link>
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
