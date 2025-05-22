"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { CheckCircle2, Clock, Search, Eye, Heart, Users, BookOpen, Shield } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { supabase } from "@/lib/supabase"
import { formatDistanceToNow } from "date-fns"
import { ko } from "date-fns/locale"

interface PrayersListProps {
  userId: string
  targetCategory: string | null
  topicCategory: string | null
}

export function PrayersList({ userId, targetCategory, topicCategory }: PrayersListProps) {
  const [prayers, setPrayers] = useState<any[]>([])
  const [filteredPrayers, setFilteredPrayers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  // 실제 기도 데이터
  const realPrayers = [
    {
      id: "prayer-1",
      title: "자녀를 위한 기도",
      content:
        "하나님 아버지, 제 자녀들을 주님의 말씀으로 인도해 주세요. 그들이 주님을 경외하며 지혜롭게 자라나게 해주시고, 주님의 뜻을 따르는 삶을 살게 해주세요. 그들의 마음에 주님의 말씀을 심어주시고, 세상의 유혹에서 지켜주세요. 자녀들이 믿음 안에서 강건하게 자라나 주님의 영광을 위한 도구로 쓰임 받게 해주세요. 예수님의 이름으로 기도합니다. 아멘.",
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
        "은혜로우신 하나님, 오늘 하루도 주님의 선하심과 인자하심을 경험하게 하심에 감사드립니다. 주님께서 베풀어주신 모든 축복과 은혜에 감사드리며, 어려운 상황 속에서도 감사할 수 있는 마음을 주심에 감사드립니다. 주님의 신실하심과 변함없는 사랑에 감사드리며, 모든 영광을 주님께 돌려드립니다. 예수님의 이름으로 기도합니다. 아멘.",
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
        "하나님 아버지, 저의 부모님을 축복해 주세요. 그들의 건강을 지켜주시고, 매일의 삶 속에서 주님의 인도하심을 경험하게 해주세요. 부모님께 지혜와 분별력을 주셔서 모든 결정에서 주님의 뜻을 구하게 해주시고, 그들의 믿음이 더욱 깊어지게 해주세요. 부모님의 수고와 헌신에 감사드리며, 그들에게 평안과 기쁨이 넘치게 해주세요. 예수님의 이름으로 기도합니다. 아멘.",
      target_category: "부모",
      topic_category: "중보",
      is_answered: false,
      created_at: new Date(Date.now() - 259200000).toISOString(),
      scripture: "출애굽기 20:12 - 네 부모를 공경하라 그리하면 네 하나님 여호와가 네게 준 땅에서 네 생명이 길리라",
    },
    {
      id: "prayer-4",
      title: "회개 기도",
      content:
        "자비로우신 하나님, 제가 주님 앞에 죄를 지었음을 고백합니다. 제 마음과 생각, 행동으로 주님의 뜻을 거스른 모든 일에 대해 용서를 구합니다. 주님의 말씀에 순종하지 못하고, 이웃을 내 몸과 같이 사랑하지 못했습니다. 저를 깨끗하게 하시고, 주님의 길로 인도해 주세요. 예수 그리스도의 보혈로 저를 씻어주시고, 새로운 마음을 주셔서 주님을 더욱 가까이 따르게 해주세요. 예수님의 이름으로 기도합니다. 아멘.",
      target_category: "자신",
      topic_category: "회개",
      is_answered: true,
      created_at: new Date(Date.now() - 345600000).toISOString(),
      scripture: "시편 51:10 - 하나님이여 내 속에 정한 마음을 창조하시고 내 안에 정직한 영을 새롭게 하소서",
    },
    {
      id: "prayer-5",
      title: "교회를 위한 기도",
      content:
        "하나님 아버지, 저희 교회를 축복해 주세요. 모든 성도들이 주님의 말씀 안에서 하나되게 하시고, 서로 사랑하며 섬기는 공동체가 되게 해주세요. 목회자들에게 지혜와 분별력을 주셔서 교회를 잘 이끌어가게 하시고, 모든 사역이 주님의 뜻 안에서 이루어지게 해주세요. 교회가 이 세상에서 빛과 소금의 역할을 감당하며, 많은 영혼들이 구원받는 통로가 되게 해주세요. 예수님의 이름으로 기도합니다. 아멘.",
      target_category: "교회",
      topic_category: "중보",
      is_answered: false,
      created_at: new Date(Date.now() - 432000000).toISOString(),
      scripture: "마태복음 16:18 - 내가 이 반석 위에 내 교회를 세우리니 음부의 권세가 이기지 못하리라",
    },
    {
      id: "prayer-6",
      title: "배우자를 위한 기도",
      content:
        "사랑의 하나님, 제 배우자를 축복해 주세요. 그에게 건강과 지혜를 주시고, 매일의 삶 속에서 주님의 인도하심을 경험하게 해주세요. 우리의 관계가 주님 안에서 더욱 깊어지고 성숙해지게 하시며, 서로를 이해하고 존중하는 마음을 주세요. 함께 주님을 섬기며 믿음의 가정을 이루어가게 해주시고, 어려운 시간 속에서도 서로에게 힘이 되게 해주세요. 예수님의 이름으로 기도합니다. 아멘.",
      target_category: "배우자",
      topic_category: "사랑",
      is_answered: false,
      created_at: new Date(Date.now() - 518400000).toISOString(),
      scripture:
        "에베소서 5:25 - 남편들아 아내 사랑하기를 그리스도께서 교회를 사랑하시고 그 교회를 위하여 자신을 주심같이 하라",
    },
  ]

  // 기도 목록 가져오기
  useEffect(() => {
    const fetchPrayers = async () => {
      try {
        setIsLoading(true)

        // 테스트 ID인 경우 실제 기도 데이터 반환
        if (userId === "guest") {
          setPrayers(realPrayers)
          setFilteredPrayers(realPrayers)
          setIsLoading(false)
          return
        }

        // 실제 데이터 가져오기
        const query = supabase
          .from("prayers")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })

        const { data, error } = await query

        if (error) throw error
        setPrayers(data || [])
        setFilteredPrayers(data || [])
      } catch (err) {
        console.error("기도 불러오기 오류:", err)
        setError("기도를 불러오는 중 오류가 발생했습니다.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchPrayers()
  }, [userId])

  // 카테고리 또는 검색어 변경 시 필터링
  useEffect(() => {
    let result = prayers

    // 대상 카테고리 필터링
    if (targetCategory) {
      result = result.filter((prayer) => prayer.target_category === targetCategory)
    }

    // 주제 카테고리 필터링
    if (topicCategory) {
      result = result.filter((prayer) => prayer.topic_category === topicCategory)
    }

    // 검색어 필터링
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (prayer) => prayer.title.toLowerCase().includes(query) || prayer.content.toLowerCase().includes(query),
      )
    }

    setFilteredPrayers(result)
  }, [prayers, targetCategory, topicCategory, searchQuery])

  // 카테고리에 맞는 아이콘 반환
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "자녀":
        return <Users className="h-4 w-4 text-amber-600" />
      case "부모":
        return <Heart className="h-4 w-4 text-amber-600" />
      case "배우자":
        return <Heart className="h-4 w-4 text-amber-600" />
      case "자신":
        return <BookOpen className="h-4 w-4 text-amber-600" />
      case "교회":
        return <Shield className="h-4 w-4 text-amber-600" />
      default:
        return <BookOpen className="h-4 w-4 text-amber-600" />
    }
  }

  if (isLoading) {
    return (
      <Card className="border-none shadow-lg bg-white rounded-2xl card-mystical">
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <p className="text-amber-800">기도 목록을 불러오고 있습니다...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="border-none shadow-lg bg-white rounded-2xl">
        <CardContent className="pt-6">
          <div className="text-center py-8 text-red-500">{error}</div>
        </CardContent>
      </Card>
    )
  }

  const getCategoryTitle = () => {
    if (targetCategory && topicCategory) {
      return `${targetCategory}를 위한 ${topicCategory} 기도`
    } else if (targetCategory) {
      return `${targetCategory}를 위한 기도`
    } else if (topicCategory) {
      return `${topicCategory} 기도`
    } else {
      return "모든 기도"
    }
  }

  return (
    <Card className="border-none shadow-lg bg-white rounded-2xl card-mystical">
      <CardHeader className="pb-3 bg-amber-50 rounded-t-2xl">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <CardTitle className="text-amber-900 text-lg">{getCategoryTitle()}</CardTitle>
            <CardDescription className="text-amber-700">{filteredPrayers.length}개의 기도가 있습니다</CardDescription>
          </div>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-amber-500" />
            <Input
              type="search"
              placeholder="기도 검색..."
              className="pl-8 bg-white border-amber-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        {filteredPrayers.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-amber-800 mb-4">기도 목록이 없습니다.</p>
            <Button asChild className="bg-amber-500 hover:bg-amber-600 text-white animate-pulse-soft">
              <Link href="/prayers/new">첫 기도 기록하기</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredPrayers.map((prayer) => (
              <div
                key={prayer.id}
                className="flex items-start p-4 rounded-xl border border-amber-100 hover:bg-amber-50 transition-colors card-mystical"
              >
                <div className="mr-3 mt-1">{getCategoryIcon(prayer.target_category)}</div>
                <div className="flex-1">
                  <div className="flex items-center flex-wrap gap-2">
                    <h3 className="font-medium text-amber-900">{prayer.title}</h3>
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
                  <p className="text-sm text-amber-800 mt-1 line-clamp-2">{prayer.content}</p>
                  <div className="flex items-center mt-2 text-xs text-amber-600">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>{formatDistanceToNow(new Date(prayer.created_at), { addSuffix: true, locale: ko })}</span>
                  </div>
                </div>
                <Button
                  asChild
                  variant="outline"
                  size="icon"
                  className="ml-2 text-amber-600 hover:text-amber-800 hover:bg-amber-100 rounded-full h-9 w-9 animate-pulse-soft"
                >
                  <Link href={`/prayers/${prayer.id}`}>
                    <Eye className="h-4 w-4" />
                    <span className="sr-only">보기</span>
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
