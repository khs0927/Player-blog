"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/contexts/auth-context"

interface PrayerCategoriesProps {
  selectedTargetCategory: string | null
  selectedTopicCategory: string | null
  onSelectCategory: (type: "target" | "topic", category: string | null) => void
}

export function PrayerCategories({
  selectedTargetCategory,
  selectedTopicCategory,
  onSelectCategory,
}: PrayerCategoriesProps) {
  const [targetCategories, setTargetCategories] = useState<{ name: string; count: number }[]>([])
  const [topicCategories, setTopicCategories] = useState<{ name: string; count: number }[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<string>("대상")
  const { user } = useAuth()

  // 카테고리 목록 가져오기
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true)

        // 테스트 데이터
        if (!user || user.id === "guest") {
          setTargetCategories([
            { name: "자녀", count: 5 },
            { name: "부모", count: 3 },
            { name: "배우자", count: 2 },
            { name: "자신", count: 4 },
            { name: "교회", count: 1 },
          ])

          setTopicCategories([
            { name: "감사", count: 5 },
            { name: "중보", count: 3 },
            { name: "간구", count: 2 },
            { name: "회개", count: 1 },
            { name: "사랑", count: 3 },
            { name: "용서", count: 2 },
          ])

          setIsLoading(false)
          return
        }

        // 실제 데이터 가져오기 (구현 예정)
        // ...
      } catch (err) {
        console.error("카테고리 불러오기 오류:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategories()
  }, [user])

  return (
    <Card className="border-none shadow-lg bg-white rounded-2xl">
      <CardHeader className="bg-amber-50 pb-3 rounded-t-2xl">
        <CardTitle className="text-amber-900 text-lg">카테고리</CardTitle>
      </CardHeader>
      <CardContent className="p-3">
        <Tabs defaultValue="대상" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 mb-3 bg-amber-50">
            <TabsTrigger value="대상" className="data-[state=active]:bg-amber-200">
              대상
            </TabsTrigger>
            <TabsTrigger value="주제" className="data-[state=active]:bg-amber-200">
              주제
            </TabsTrigger>
          </TabsList>

          <TabsContent value="대상" className="mt-0">
            <div className="space-y-1">
              <Button
                variant="ghost"
                className={`w-full justify-start ${
                  selectedTargetCategory === null
                    ? "bg-amber-100 text-amber-900 hover:bg-amber-200"
                    : "hover:bg-amber-50 hover:text-amber-900"
                }`}
                onClick={() => onSelectCategory("target", null)}
              >
                전체 보기
              </Button>

              {isLoading ? (
                <div className="py-2 text-sm text-amber-800">로딩 중...</div>
              ) : (
                targetCategories.map((category) => (
                  <Button
                    key={category.name}
                    variant="ghost"
                    className={`w-full justify-start ${
                      selectedTargetCategory === category.name
                        ? "bg-amber-100 text-amber-900 hover:bg-amber-200"
                        : "hover:bg-amber-50 hover:text-amber-900"
                    }`}
                    onClick={() => onSelectCategory("target", category.name)}
                  >
                    {category.name}
                    <span className="ml-auto text-xs text-amber-600">{category.count}</span>
                  </Button>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="주제" className="mt-0">
            <div className="space-y-1">
              <Button
                variant="ghost"
                className={`w-full justify-start ${
                  selectedTopicCategory === null
                    ? "bg-amber-100 text-amber-900 hover:bg-amber-200"
                    : "hover:bg-amber-50 hover:text-amber-900"
                }`}
                onClick={() => onSelectCategory("topic", null)}
              >
                전체 보기
              </Button>

              {isLoading ? (
                <div className="py-2 text-sm text-amber-800">로딩 중...</div>
              ) : (
                topicCategories.map((category) => (
                  <Button
                    key={category.name}
                    variant="ghost"
                    className={`w-full justify-start ${
                      selectedTopicCategory === category.name
                        ? "bg-amber-100 text-amber-900 hover:bg-amber-200"
                        : "hover:bg-amber-50 hover:text-amber-900"
                    }`}
                    onClick={() => onSelectCategory("topic", category.name)}
                  >
                    {category.name}
                    <span className="ml-auto text-xs text-amber-600">{category.count}</span>
                  </Button>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
