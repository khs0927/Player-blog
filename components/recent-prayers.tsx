"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { CheckCircle, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"
import { formatDistanceToNow } from "date-fns"
import { ko } from "date-fns/locale"

interface RecentPrayersProps {
  userId: string
}

export function RecentPrayers({ userId }: RecentPrayersProps) {
  const [prayers, setPrayers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPrayers = async () => {
      try {
        // 테스트 ID인 경우 테스트 데이터 반환
        if (userId === "guest" || userId === "test-user-id") {
          const testPrayers = [
            {
              id: "test-1",
              title: "테스트 기도 1",
              content: "이것은 개발 환경에서 표시되는 테스트 기도입니다.",
              category: "테스트",
              is_answered: false,
              created_at: new Date().toISOString(),
            },
            {
              id: "test-2",
              title: "테스트 기도 2",
              content: "두 번째 테스트 기도입니다.",
              category: "감사",
              is_answered: true,
              created_at: new Date(Date.now() - 86400000).toISOString(), // 하루 전
            },
          ]
          setPrayers(testPrayers)
          setIsLoading(false)
          return
        }

        // 실제 데이터 가져오기
        const { data, error } = await supabase
          .from("prayers")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })
          .limit(5)

        if (error) throw error
        setPrayers(data || [])
      } catch (err) {
        console.error("Error fetching prayers:", err)
        setError("기도를 불러오는 중 오류가 발생했습니다.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchPrayers()
  }, [userId])

  if (isLoading) {
    return <div className="text-center py-4">로딩 중...</div>
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">{error}</div>
  }

  if (!prayers || prayers.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">아직 작성한 기도가 없습니다.</p>
        <Button asChild className="bg-amber-600 hover:bg-amber-700">
          <Link href="/prayers/new">첫 기도 작성하기</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {prayers.map((prayer) => (
        <div
          key={prayer.id}
          className="flex items-start p-4 rounded-lg border border-amber-100 hover:bg-amber-50 transition-colors"
        >
          <div className="flex-1">
            <div className="flex items-center">
              <h3 className="font-medium text-amber-900">{prayer.title}</h3>
              {prayer.is_answered && (
                <Badge className="ml-2 bg-green-100 text-green-800 hover:bg-green-200 border-green-200">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  응답됨
                </Badge>
              )}
              {prayer.category && (
                <Badge className="ml-2 bg-amber-100 text-amber-800 hover:bg-amber-200 border-amber-200">
                  {prayer.category}
                </Badge>
              )}
            </div>
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{prayer.content}</p>
            <div className="flex items-center mt-2 text-xs text-gray-500">
              <Clock className="h-3 w-3 mr-1" />
              <span>{formatDistanceToNow(new Date(prayer.created_at), { addSuffix: true, locale: ko })}</span>
            </div>
          </div>
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="ml-2 text-amber-600 hover:text-amber-800 hover:bg-amber-100"
          >
            <Link href={`/prayers/${prayer.id}`}>보기</Link>
          </Button>
        </div>
      ))}
      <div className="text-center pt-2">
        <Button asChild variant="outline" className="border-amber-200 text-amber-800 hover:bg-amber-100">
          <Link href="/prayers">모든 기도 보기</Link>
        </Button>
      </div>
    </div>
  )
}
