"use client"

import { Badge } from "@/components/ui/badge"

import { useState, useEffect } from "react"
import Link from "next/link"
import { format } from "date-fns"
import { ko } from "date-fns/locale"
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { SiteHeader } from "@/components/site-header"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/auth-context"

export default function MeditationsPage() {
  const [date, setDate] = useState<Date>(new Date())
  const [meditations, setMeditations] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()

  // 날짜 변경 핸들러
  const handleDateChange = (newDate: Date | undefined) => {
    if (newDate) {
      setDate(newDate)
    }
  }

  // 이전 날짜로 이동
  const goToPreviousDay = () => {
    const newDate = new Date(date)
    newDate.setDate(newDate.getDate() - 1)
    setDate(newDate)
  }

  // 다음 날짜로 이동
  const goToNextDay = () => {
    const newDate = new Date(date)
    newDate.setDate(newDate.getDate() + 1)
    setDate(newDate)
  }

  // 선택한 날짜의 묵상 목록 가져오기
  useEffect(() => {
    const fetchMeditations = async () => {
      try {
        setIsLoading(true)
        const selectedDate = format(date, "yyyy-MM-dd")

        // 테스트 데이터
        if (!user || user.id === "guest") {
          const testMeditations = [
            {
              id: "med-1",
              title: "자녀를 위한 기도 묵상",
              prayer_id: "test-1",
              prayer_title: "자녀를 위한 기도",
              prayer_content: "하나님 아버지, 제 자녀들을 주님의 말씀으로 인도해 주세요...",
              scripture: "잠언 22:6 - 마땅히 행할 길을 아이에게 가르치라 그리하면 늙어도 그것을 떠나지 아니하리라",
              target_category: "자녀",
              topic_category: "중보",
              created_at: new Date().toISOString(),
            },
            {
              id: "med-2",
              title: "감사 기도 묵상",
              prayer_id: "test-2",
              prayer_title: "감사 기도",
              prayer_content:
                "은혜로우신 하나님, 오늘 하루도 주님의 선하심과 인자하심을 경험하게 하심에 감사드립니다...",
              scripture: "시편 136:1 - 여호와께 감사하라 그는 선하시며 그의 인자하심이 영원함이로다",
              target_category: "자신",
              topic_category: "감사",
              created_at: new Date().toISOString(),
            },
          ]
          setMeditations(testMeditations)
          setIsLoading(false)
          return
        }

        // 실제 데이터 가져오기
        // ...
      } catch (error) {
        console.error("묵상 목록 불러오기 오류:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMeditations()
  }, [date, user])

  return (
    <div className="flex flex-col min-h-screen bg-amber-100">
      <SiteHeader />
      <main className="flex-1 py-6">
        <div className="container px-4 md:px-6 max-w-4xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-amber-900">묵상</h1>
              <p className="text-amber-800 mt-1">날짜별 기도 묵상을 확인하세요.</p>
            </div>
          </div>

          <Card className="border-none shadow-lg bg-white rounded-2xl mb-6">
            <CardHeader className="bg-amber-50 pb-3 rounded-t-2xl">
              <CardTitle className="text-amber-900 text-lg">날짜 선택</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={goToPreviousDay}
                  className="border-amber-200 text-amber-800 hover:bg-amber-100"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-[240px] justify-center text-left font-normal border-amber-200 text-amber-800 hover:bg-amber-100",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(date, "PPP", { locale: ko })}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="center">
                    <Calendar mode="single" selected={date} onSelect={handleDateChange} initialFocus locale={ko} />
                  </PopoverContent>
                </Popover>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={goToNextDay}
                  className="border-amber-200 text-amber-800 hover:bg-amber-100"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-amber-900">
              {format(date, "yyyy년 MM월 dd일", { locale: ko })}의 묵상
            </h2>

            {isLoading ? (
              <div className="text-center py-8">
                <p className="text-amber-800">묵상 목록을 불러오고 있습니다...</p>
              </div>
            ) : meditations.length === 0 ? (
              <Card className="border-none shadow-lg bg-white rounded-2xl">
                <CardContent className="p-6 text-center">
                  <p className="text-amber-800 mb-4">이 날짜에 기록된 묵상이 없습니다.</p>
                  <Button asChild className="bg-amber-500 hover:bg-amber-600 text-white">
                    <Link href="/prayers">기도 목록 보기</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {meditations.map((meditation) => (
                  <Card
                    key={meditation.id}
                    className="border-none shadow-lg bg-white rounded-2xl hover:shadow-xl transition-shadow"
                  >
                    <CardHeader className="bg-amber-50 pb-3 rounded-t-2xl">
                      <CardTitle className="text-amber-900">{meditation.prayer_title}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200 border-amber-200">
                          {meditation.target_category}
                        </Badge>
                        <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200 border-amber-200">
                          {meditation.topic_category}
                        </Badge>
                      </div>
                      <p className="text-sm text-amber-800 line-clamp-3 mb-3">{meditation.prayer_content}</p>
                      <Button asChild className="w-full bg-amber-500 hover:bg-amber-600 text-white">
                        <Link href={`/meditations/${format(date, "yyyy-MM-dd")}/${meditation.prayer_id}`}>
                          묵상 보기
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
