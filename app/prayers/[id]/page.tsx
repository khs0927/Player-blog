"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, MessageCircle, CheckCircle2, RefreshCw, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SiteHeader } from "@/components/site-header"
import { AiChat } from "@/components/ai-chat"
import { supabase } from "@/lib/supabase"
import { formatDistanceToNow } from "date-fns"
import { ko } from "date-fns/locale"

export default function PrayerDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [prayer, setPrayer] = useState<any | null>(null)
  const [additionalPrayers, setAdditionalPrayers] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showAiChat, setShowAiChat] = useState(false)
  const [question, setQuestion] = useState("")

  useEffect(() => {
    const fetchPrayer = async () => {
      try {
        setIsLoading(true)
        const prayerId = params.id

        // 테스트 ID인 경우 테스트 데이터 반환
        if (prayerId.startsWith("prayer-")) {
          // 실제 기도 데이터 사용
          const realPrayers = [
            {
              id: "prayer-1",
              title: "자녀를 위한 기도",
              content:
                "하나님 아버지, 제 지혜가 아닌 주님의 지혜로 자녀들을 인도하게 하소서. 제 안에 주님이 임재하셔서 자녀들을 주님의 뜻대로 양육할 수 있게 하소서. 저의 생각과 방법이 아닌, 오직 주님의 말씀에 따라 자녀들을 가르치게 하시고, 제가 먼저 주님 안에서 온전히 변화되어 자녀들에게 본이 되게 하소서. 자녀들이 이 세상의 가치관이 아닌 하나님 나라의 가치관으로 자라나게 하시고, 그들 안에 주님이 거하시어 주님의 뜻을 이루는 도구로 사용되게 하소서. 예수님의 이름으로 기도합니다. 아멘.",
              target_category: "자녀",
              topic_category: "중보",
              is_answered: false,
              created_at: new Date(Date.now() - 86400000).toISOString(),
              scripture: "잠언 22:6 - 마땅히 행할 길을 아이에게 가르치라 그리하면 늙어도 그것을 떠나지 아니하리라",
            },
            {
              id: "prayer-2",
              title: "감사 기도",
              content:
                "은혜로우신 하나님, 제 안에 주님이 임재하심에 감사드립니다. 제 지혜와 능력이 아닌, 오직 주님의 지혜와 능력으로 살아가게 하심에 감사드립니다. 주님께서 저를 통해 일하시고, 제 안에 계셔서 저를 주님의 형상으로 빚어가심에 감사드립니다. 제가 아니라 내 안에 계신 그리스도께서 살아계심을 매일 경험하게 하시니 감사합니다. 모든 상황 속에서 제 뜻이 아닌 주님의 뜻을 구하며, 주님의 인도하심을 따라 살아가게 하소서. 예수님의 이름으로 기도합니다. 아멘.",
              target_category: "자신",
              topic_category: "감사",
              is_answered: true,
              created_at: new Date(Date.now() - 172800000).toISOString(),
              scripture: "시편 136:1 - 여호와께 감사하라 그는 선하시며 그의 인자하심이 영원함이로다",
            },
            {
              id: "prayer-3",
              title: "부모님을 위한 기도",
              content:
                "사랑의 하나님, 저의 부모님 안에 주님이 임재하셔서 그들의 마음과 생각을 다스려 주시기를 기도합니다. 부모님이 자신의 지혜가 아닌 주님의 지혜를 구하며 살아가게 하시고, 그들 안에 그리스도께서 온전히 거하시어 주님의 뜻을 이루는 삶을 살게 하소서. 부모님이 세상의 기준이 아닌 하나님 나라의 가치관으로 모든 결정을 내리게 하시고, 그들의 삶을 통해 주님의 영광이 드러나게 하소서. 부모님이 자신을 내려놓고 오직 주님만을 높이는 삶을 살게 하시고, 그 안에서 참된 기쁨과 평안을 누리게 하소서. 예수님의 이름으로 기도합니다. 아멘.",
              target_category: "부모",
              topic_category: "중보",
              is_answered: false,
              created_at: new Date(Date.now() - 259200000).toISOString(),
              scripture:
                "마태복음 19:14 - 예수께서 이르시되 어린 아이들을 용납하고 내게 오는 것을 금하지 말라 천국이 이런 사람의 것이니라",
            },
          ]

          const foundPrayer = realPrayers.find((p) => p.id === prayerId)
          if (foundPrayer) {
            setPrayer(foundPrayer)
          } else {
            throw new Error("기도를 찾을 수 없습니다.")
          }
          setIsLoading(false)
          return
        }

        // 실제 데이터 가져오기
        const { data, error } = await supabase.from("prayers").select("*").eq("id", prayerId).single()

        if (error) throw error
        setPrayer(data)
      } catch (err) {
        console.error("기도 상세 정보 불러오기 오류:", err)
        setError("기도 정보를 불러오는 중 오류가 발생했습니다.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchPrayer()
  }, [params.id])

  // 추가 기도문 생성
  const generateAdditionalPrayer = async () => {
    if (!prayer) return

    try {
      setIsGenerating(true)

      // API 호출하여 추가 기도문 생성
      const response = await fetch("/api/generate-prayer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prayerType: `${prayer.target_category}를 위한 ${prayer.topic_category} 기도`,
        }),
      })

      if (!response.ok) {
        throw new Error("기도문 생성에 실패했습니다.")
      }

      const data = await response.json()

      // 성경 구절과 기도문을 함께 표시
      const formattedPrayer = `${data.scripture}\n\n${data.prayer}`

      setAdditionalPrayers((prev) => [...prev, formattedPrayer])
    } catch (error) {
      console.error("추가 기도문 생성 오류:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  // AI 채팅 토글
  const toggleAiChat = () => {
    setShowAiChat(!showAiChat)
  }

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-amber-50 via-amber-100 to-amber-200">
        <SiteHeader />
        <main className="flex-1 py-6">
          <div className="container px-4 md:px-6 max-w-4xl">
            <div className="text-center py-12">
              <p className="text-amber-800">기도 정보를 불러오고 있습니다...</p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (error || !prayer) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-amber-50 via-amber-100 to-amber-200">
        <SiteHeader />
        <main className="flex-1 py-6">
          <div className="container px-4 md:px-6 max-w-4xl">
            <div className="text-center py-12">
              <p className="text-red-500">{error || "기도 정보를 찾을 수 없습니다."}</p>
              <Button asChild className="mt-4 bg-amber-500 hover:bg-amber-600 text-white">
                <Link href="/prayers">기도 목록으로 돌아가기</Link>
              </Button>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-amber-50 via-amber-100 to-amber-200">
      <SiteHeader />
      <main className="flex-1 py-6">
        <div className="container px-4 md:px-6 max-w-4xl">
          <Button asChild variant="ghost" className="mb-4 text-amber-800 hover:bg-amber-200 hover:text-amber-900">
            <Link href="/prayers">
              <ArrowLeft className="mr-2 h-4 w-4" />
              기도 목록으로 돌아가기
            </Link>
          </Button>

          <Card className="border-none shadow-lg bg-white rounded-2xl card-mystical">
            <CardHeader className="bg-gradient-to-r from-amber-100 to-amber-50 pb-3 rounded-t-2xl">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <CardTitle className="text-xl text-amber-900">{prayer.title}</CardTitle>
                <div className="flex flex-wrap gap-2">
                  {prayer.is_answered && (
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-green-200">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      응답됨
                    </Badge>
                  )}
                  <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200 border-amber-200">
                    {prayer.target_category}
                  </Badge>
                  <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200 border-amber-200">
                    {prayer.topic_category}
                  </Badge>
                </div>
              </div>
              <div className="text-xs text-amber-700">
                {formatDistanceToNow(new Date(prayer.created_at), { addSuffix: true, locale: ko })} 작성
              </div>
            </CardHeader>

            <CardContent className="p-5">
              <div className="bg-amber-50 rounded-xl p-5 border border-amber-100 mb-4 card-mystical animate-float">
                {/* 성경 구절을 먼저 표시 */}
                {prayer.scripture && (
                  <div className="mb-4 pb-3 border-b border-amber-100">
                    <p className="scripture-text">{prayer.scripture}</p>
                  </div>
                )}
                <p className="prayer-text">{prayer.content}</p>
              </div>

              {additionalPrayers.length > 0 && (
                <div className="mt-6 space-y-4">
                  <h3 className="text-lg font-medium text-amber-900">추가 기도문</h3>
                  {additionalPrayers.map((additionalPrayer, index) => (
                    <div
                      key={index}
                      className="bg-amber-50 rounded-xl p-5 border border-amber-100 card-mystical animate-float"
                    >
                      <p className="prayer-text">{additionalPrayer}</p>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-6 flex justify-center">
                <Button
                  onClick={generateAdditionalPrayer}
                  className="btn-primary animate-pulse-soft"
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      기도문 생성 중...
                    </>
                  ) : (
                    <>
                      <BookOpen className="mr-2 h-4 w-4" />
                      기도문 더 받기
                    </>
                  )}
                </Button>
              </div>

              {showAiChat && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium text-amber-900 mb-3">AI와 대화하기</h3>
                  <AiChat prayerContext={prayer} />
                </div>
              )}
            </CardContent>

            <CardFooter className="bg-gradient-to-r from-amber-50 to-amber-100 rounded-b-2xl border-t border-amber-100 flex justify-between p-4">
              <div className="w-full">
                <Button onClick={toggleAiChat} className="w-full btn-primary">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  {showAiChat ? "AI 대화 닫기" : "AI와 대화하기"}
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  )
}
