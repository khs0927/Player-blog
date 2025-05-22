"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { supabase } from "@/lib/supabase"

export function WeeklyChallenge() {
  const [challenge, setChallenge] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        // 현재 주의 시작일 계산
        const startOfWeek = new Date()
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay())
        startOfWeek.setHours(0, 0, 0, 0)

        // 주간 도전 가져오기
        const { data, error } = await supabase
          .from("prayers")
          .select("*")
          .eq("is_weekly_challenge", true)
          .gte("created_at", startOfWeek.toISOString())
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle()

        if (error) throw error

        setChallenge(data)

        // 진행 상황 계산
        const today = new Date()
        const dayOfWeek = today.getDay() // 0 = Sunday, 6 = Saturday
        setProgress(((dayOfWeek + 1) / 7) * 100)
      } catch (err) {
        console.error("Error fetching weekly challenge:", err)
        setError("주간 도전을 불러오는 중 오류가 발생했습니다.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchChallenge()
  }, [])

  if (isLoading) {
    return <div className="text-center py-4">로딩 중...</div>
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">{error}</div>
  }

  // 도전이 없는 경우 테스트 데이터 표시
  if (!challenge) {
    // 테스트 도전 데이터
    const testChallenge = {
      id: "test-challenge",
      title: "이번 주 기도 도전",
      content: "매일 아침 5분씩 감사 기도를 드리며 하루를 시작하세요.",
    }

    return (
      <div className="py-4">
        <h3 className="font-medium text-amber-900 mb-2">{testChallenge.title}</h3>
        <p className="text-sm text-gray-600 mb-4 line-clamp-3">{testChallenge.content}</p>

        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-xs text-gray-500">
            <span>일요일</span>
            <span>토요일</span>
          </div>
          <Progress value={progress} className="h-2 bg-amber-100" />
          <div className="text-xs text-center text-gray-500">이번 주 {Math.round(progress)}% 완료</div>
        </div>

        <Button asChild className="w-full bg-amber-600 hover:bg-amber-700">
          <Link href={`/prayers/${testChallenge.id}`}>도전 참여하기</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="py-4">
      <h3 className="font-medium text-amber-900 mb-2">{challenge.title}</h3>
      <p className="text-sm text-gray-600 mb-4 line-clamp-3">{challenge.content}</p>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-xs text-gray-500">
          <span>일요일</span>
          <span>토요일</span>
        </div>
        <Progress value={progress} className="h-2 bg-amber-100" />
        <div className="text-xs text-center text-gray-500">이번 주 {Math.round(progress)}% 완료</div>
      </div>

      <Button asChild className="w-full bg-amber-600 hover:bg-amber-700">
        <Link href={`/prayers/${challenge.id}`}>도전 참여하기</Link>
      </Button>
    </div>
  )
}
