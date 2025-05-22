"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, RefreshCw, Copy, Check, BookOpen, Share2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface PrayerGeneratorProps {
  prayerType: string
}

export function PrayerGenerator({ prayerType }: PrayerGeneratorProps) {
  const [prayer, setPrayer] = useState<string>("")
  const [scripture, setScripture] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState<boolean>(false)
  const { toast } = useToast()

  // 기도문 생성
  const generatePrayer = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/generate-prayer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prayerType }),
      })

      if (!response.ok) {
        throw new Error("기도문 생성에 실패했습니다.")
      }

      const data = await response.json()
      setPrayer(data.prayer)
      setScripture(data.scripture)
    } catch (err) {
      console.error("기도문 생성 오류:", err)
      setError("기도문을 생성하는 중 오류가 발생했습니다. 다시 시도해주세요.")

      // 오류 발생 시 샘플 기도문 표시
      setPrayer(getSamplePrayer(prayerType).prayer)
      setScripture(getSamplePrayer(prayerType).scripture)
    } finally {
      setIsLoading(false)
    }
  }

  // 기도 유형이 변경될 때 기도문 생성
  useEffect(() => {
    if (prayerType) {
      generatePrayer()
    }
  }, [prayerType])

  // 클립보드에 복사
  const copyToClipboard = () => {
    const textToCopy = `${scripture}\n\n${prayer}`
    navigator.clipboard.writeText(textToCopy)
    setCopied(true)
    toast({
      title: "복사 완료",
      description: "기도문이 클립보드에 복사되었습니다.",
    })
    setTimeout(() => setCopied(false), 2000)
  }

  // 공유하기
  const sharePrayer = async () => {
    const shareText = `${scripture}\n\n${prayer}`

    if (navigator.share) {
      try {
        await navigator.share({
          title: "성경 기반 기도문",
          text: shareText,
        })
        toast({
          title: "공유 성공",
          description: "기도문이 공유되었습니다.",
        })
      } catch (error) {
        console.error("공유 오류:", error)
        // 공유 실패 시 클립보드에 복사
        copyToClipboard()
      }
    } else {
      // 공유 API를 지원하지 않는 경우 클립보드에 복사
      copyToClipboard()
    }
  }

  // 샘플 기도문 (API 오류 시 사용)
  const getSamplePrayer = (type: string) => {
    const samples: Record<string, { prayer: string; scripture: string }> = {
      "자녀를 위한 기도": {
        scripture: "잠언 22:6 - 마땅히 행할 길을 아이에게 가르치라 그리하면 늙어도 그것을 떠나지 아니하리라",
        prayer:
          "하나님 아버지, 제 지혜가 아닌 주님의 지혜로 자녀들을 인도하게 하소서. 제 안에 주님이 임재하셔서 자녀들을 주님의 뜻대로 양육할 수 있게 하소서. 저의 생각과 방법이 아닌, 오직 주님의 말씀에 따라 자녀들을 가르치게 하시고, 제가 먼저 주님 안에서 온전히 변화되어 자녀들에게 본이 되게 하소서. 자녀들이 이 세상의 가치관이 아닌 하나님 나라의 가치관으로 자라나게 하시고, 그들 안에 주님이 거하시어 주님의 뜻을 이루는 도구로 사용되게 하소서. 예수님의 이름으로 기도합니다. 아멘.",
      },
      "감사 기도": {
        scripture: "시편 136:1 - 여호와께 감사하라 그는 선하시며 그의 인자하심이 영원함이로다",
        prayer:
          "은혜로우신 하나님, 제 안에 주님이 임재하심에 감사드립니다. 제 지혜와 능력이 아닌, 오직 주님의 지혜와 능력으로 살아가게 하심에 감사드립니다. 주님께서 저를 통해 일하시고, 제 안에 계셔서 저를 주님의 형상으로 빚어가심에 감사드립니다. 제가 아니라 내 안에 계신 그리스도께서 살아계심을 매일 경험하게 하시니 감사합니다. 모든 상황 속에서 제 뜻이 아닌 주님의 뜻을 구하며, 주님의 인도하심을 따라 살아가게 하소서. 예수님의 이름으로 기도합니다. 아멘.",
      },
      "부모님을 위한 기도": {
        scripture:
          "마태복음 19:14 - 예수께서 이르시되 어린 아이들을 용납하고 내게 오는 것을 금하지 말라 천국이 이런 사람의 것이니라",
        prayer:
          "사랑의 하나님, 저의 부모님 안에 주님이 임재하셔서 그들의 마음과 생각을 다스려 주시기를 기도합니다. 부모님이 자신의 지혜가 아닌 주님의 지혜를 구하며 살아가게 하시고, 그들 안에 그리스도께서 온전히 거하시어 주님의 뜻을 이루는 삶을 살게 하소서. 부모님이 세상의 기준이 아닌 하나님 나라의 가치관으로 모든 결정을 내리게 하시고, 그들의 삶을 통해 주님의 영광이 드러나게 하소서. 부모님이 자신을 내려놓고 오직 주님만을 높이는 삶을 살게 하시고, 그 안에서 참된 기쁨과 평안을 누리게 하소서. 예수님의 이름으로 기도합니다. 아멘.",
      },
    }

    // 기본값 반환
    return (
      samples[type] || {
        scripture:
          "시편 145:18 - 여호와께서는 자기에게 간구하는 모든 자 곧 진실하게 간구하는 모든 자에게 가까이 하시는도다",
        prayer:
          "주님, 제 안에 주님이 임재하셔서 저를 통해 주님의 뜻을 이루어 주소서. 제 생각과 지혜가 아닌, 오직 주님의 지혜와 인도하심을 구합니다. 저 자신을 내려놓고 주님만이 제 안에서 역사하시게 하소서. 제가 아니라 내 안에 계신 그리스도께서 살아계심을 매일 경험하게 하시고, 모든 상황 속에서 주님의 뜻을 구하며 살아가게 하소서. 제 삶의 주인이 저 자신이 아닌 오직 주님이 되게 하시고, 주님의 영광을 위해 살아가게 하소서. 예수님의 이름으로 기도합니다. 아멘.",
      }
    )
  }

  return (
    <div className="space-y-4">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-8">
          <Loader2 className="h-10 w-10 animate-spin text-amber-600" />
          <p className="mt-3 text-amber-800">성경 말씀을 기반으로 기도문을 생성하고 있습니다...</p>
        </div>
      ) : error ? (
        <div className="text-red-500 text-sm bg-red-50 p-4 rounded-lg border border-red-200">{error}</div>
      ) : (
        <>
          <div className="bg-amber-50 rounded-xl p-5 border border-amber-100 card-mystical animate-float">
            <h3 className="font-semibold text-amber-900 text-base mb-3 flex items-center">
              <BookOpen className="w-4 h-4 mr-2 text-amber-700" />
              {prayerType}
            </h3>

            {/* 성경 구절을 먼저 표시 */}
            {scripture && (
              <div className="mb-4 pb-3 border-b border-amber-100">
                <p className="scripture-text">{scripture}</p>
              </div>
            )}

            <p className="prayer-text">{prayer}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button onClick={generatePrayer} className="flex-1 btn-primary flex items-center justify-center">
              <RefreshCw className="w-4 h-4 mr-2" />
              새로운 기도문
            </Button>
            <Button
              onClick={copyToClipboard}
              variant="outline"
              className="border-amber-200 text-amber-800 hover:bg-amber-100 flex items-center justify-center"
            >
              {copied ? <Check className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
              {copied ? "복사됨" : "복사"}
            </Button>
            <Button
              onClick={sharePrayer}
              variant="outline"
              className="border-amber-200 text-amber-800 hover:bg-amber-100 flex items-center justify-center"
            >
              <Share2 className="w-4 h-4 mr-1" />
              공유
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
