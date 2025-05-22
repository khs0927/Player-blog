"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SiteHeader } from "@/components/site-header"
import { AiChat } from "@/components/ai-chat"
import { format, parse } from "date-fns"
import { ko } from "date-fns/locale"

export default function MeditationDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [prayer, setPrayer] = useState<any | null>(null)
  const [meditation, setMeditation] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAiChat, setShowAiChat] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const prayerId = params.id
        const dateStr = params.date as string

        // 테스트 ID인 경우 테스트 데이터 반환
        if (prayerId.startsWith("test-")) {
          const testPrayer = {
            id: prayerId,
            title: "자녀를 위한 기도",
            content:
              "하나님 아버지, 제 자녀들을 주님의 말씀으로 인도해 주세요. 그들이 주님을 경외하며 지혜롭게 자라나게 해주시고, 주님의 뜻을 따르는 삶을 살게 해주세요. 그들의 마음에 주님의 말씀을 심어주시고, 세상의 유혹에서 지켜주세요. 자녀들이 믿음 안에서 강건하게 자라나 주님의 영광을 위한 도구로 쓰임 받게 해주세요. 예수님의 이름으로 기도합니다. 아멘.",
            target_category: "자녀",
            topic_category: "중보",
            is_answered: false,
            created_at: new Date().toISOString(),
            scripture: "잠언 22:6 - 마땅히 행할 길을 아이에게 가르치라 그리하면 늙어도 그것을 떠나지 아니하리라",
          }
          setPrayer(testPrayer)

          const testMeditation = {
            id: "med-1",
            content: `잠언 22:6의 말씀은 자녀 교육의 중요성을 강조합니다. "마땅히 행할 길을 아이에게 가르치라 그리하면 늙어도 그것을 떠나지 아니하리라"는 말씀은 어린 시절의 가르침이 평생 영향을 미친다는 것을 보여줍니다.

자녀를 위한 기도에서 중요한 점은 단순히 자녀의 성공이나 행복만을 구하는 것이 아니라, 하나님의 말씀 안에서 바른 길을 걷도록 인도해 달라고 구하는 것입니다. 이는 자녀가 하나님을 경외하고 그분의 뜻을 따르는 삶을 살도록 돕는 것을 의미합니다.

이 기도를 통해 우리는 자녀의 영적 성장을 위해 기도하는 부모의 마음을 볼 수 있습니다. 자녀가 세상의 유혹에 흔들리지 않고 믿음 안에서 강건하게 자라나길 바라는 마음이 담겨 있습니다.

묵상 포인트:
1. 나는 자녀(또는 내 주변의 어린이들)에게 어떤 영적 가르침을 주고 있는가?
2. 자녀의 성공보다 하나님과의 관계를 더 중요시하고 있는가?
3. 자녀가 하나님의 말씀을 따르도록 어떻게 도울 수 있을까?`,
            created_at: new Date().toISOString(),
          }
          setMeditation(testMeditation)
          setIsLoading(false)
          return
        }

        // 실제 데이터 가져오기
        // ...
      } catch (err) {
        console.error("묵상 상세 정보 불러오기 오류:", err)
        setError("묵상 정보를 불러오는 중 오류가 발생했습니다.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [params.id, params.date])

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-amber-100">
        <SiteHeader />
        <main className="flex-1 py-6">
          <div className="container px-4 md:px-6 max-w-4xl">
            <div className="text-center py-12">
              <p className="text-amber-800">묵상 정보를 불러오고 있습니다...</p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (error || !prayer || !meditation) {
    return (
      <div className="flex flex-col min-h-screen bg-amber-100">
        <SiteHeader />
        <main className="flex-1 py-6">
          <div className="container px-4 md:px-6 max-w-4xl">
            <div className="text-center py-12">
              <p className="text-red-500">{error || "묵상 정보를 찾을 수 없습니다."}</p>
              <Button asChild className="mt-4 bg-amber-500 hover:bg-amber-600 text-white">
                <Link href="/meditations">묵상 목록으로 돌아가기</Link>
              </Button>
            </div>
          </div>
        </main>
      </div>
    )
  }

  // 날짜 파싱
  const dateObj = parse(params.date as string, "yyyy-MM-dd", new Date())
  const formattedDate = format(dateObj, "yyyy년 MM월 dd일", { locale: ko })

  return (
    <div className="flex flex-col min-h-screen bg-amber-100">
      <SiteHeader />
      <main className="flex-1 py-6">
        <div className="container px-4 md:px-6 max-w-4xl">
          <Button asChild variant="ghost" className="mb-4 text-amber-800 hover:bg-amber-200 hover:text-amber-900">
            <Link href={`/meditations`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              묵상 목록으로 돌아가기
            </Link>
          </Button>

          <div className="mb-6">
            <h1 className="text-2xl font-bold text-amber-900">{formattedDate}의 묵상</h1>
            <p className="text-amber-800">{prayer.title}</p>
          </div>

          <div className="grid gap-6 md:grid-cols-12">
            <div className="md:col-span-5">
              <Card className="border-none shadow-lg bg-white rounded-2xl sticky top-20">
                <CardHeader className="bg-amber-50 pb-3 rounded-t-2xl">
                  <CardTitle className="text-amber-900">기도문</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200 border-amber-200">
                      {prayer.target_category}
                    </Badge>
                    <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200 border-amber-200">
                      {prayer.topic_category}
                    </Badge>
                  </div>
                  <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                    <p className="text-sm text-amber-800 whitespace-pre-line">{prayer.content}</p>
                    {prayer.scripture && (
                      <div className="mt-3 pt-3 border-t border-amber-100">
                        <p className="text-xs italic text-amber-700">{prayer.scripture}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="md:col-span-7">
              <Card className="border-none shadow-lg bg-white rounded-2xl">
                <CardHeader className="bg-amber-50 pb-3 rounded-t-2xl">
                  <CardTitle className="text-amber-900">오늘의 묵상</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="bg-white rounded-xl p-4">
                    <p className="text-amber-800 whitespace-pre-line">{meditation.content}</p>
                  </div>

                  <div className="mt-6">
                    <Button
                      onClick={() => setShowAiChat(!showAiChat)}
                      className="w-full bg-amber-500 hover:bg-amber-600 text-white"
                    >
                      <MessageCircle className="mr-2 h-4 w-4" />
                      {showAiChat ? "AI 채팅 닫기" : "AI와 대화하기"}
                    </Button>
                  </div>

                  {showAiChat && (
                    <div className="mt-4">
                      <AiChat prayerContext={prayer} />
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
