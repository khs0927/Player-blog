"use client"

import { useState, useEffect } from "react"
import { SiteHeader } from "@/components/site-header"
import { WeeklyPlan } from "@/components/weekly-plan"
import { PrayerTypeSelector } from "@/components/prayer-type-selector"
import { PrayerGenerator } from "@/components/prayer-generator"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, Calendar, BookOpen } from "lucide-react"

export default function HomePage() {
  const [selectedPrayerType, setSelectedPrayerType] = useState<string | null>(null)
  const [todayPlans, setTodayPlans] = useState<string[]>([])
  const { isAuthenticated, user } = useAuth()
  const { toast } = useToast()

  // 오늘 날짜 계산
  const today = new Date()
  const dayOfWeek = today.getDay() // 0: 일요일, 1: 월요일, ...

  // 기도 유형 선택 핸들러
  const handlePrayerTypeSelect = (type: string) => {
    setSelectedPrayerType(type)

    // 이미 선택된 기도 유형이 아니면 추가
    if (!todayPlans.includes(type)) {
      const updatedPlans = [...todayPlans, type]
      setTodayPlans(updatedPlans)

      // 로그인한 경우 DB에 저장
      if (isAuthenticated && user) {
        savePrayerPlan(updatedPlans)
      } else {
        // 로컬 스토리지에 저장
        localStorage.setItem("todayPrayerPlans", JSON.stringify(updatedPlans))
      }

      toast({
        title: "기도 계획 추가",
        description: `${type} 기도가 오늘의 계획에 추가되었습니다.`,
      })
    }
  }

  // 기도 계획 저장
  const savePrayerPlan = async (plans: string[]) => {
    if (!user) return

    try {
      const planDate = today.toISOString().split("T")[0]

      // 기존 계획 확인
      const { data: existingPlan } = await supabase
        .from("prayer_plans")
        .select("*")
        .eq("user_id", user.id)
        .eq("plan_date", planDate)
        .single()

      if (existingPlan) {
        // 기존 계획 업데이트
        await supabase.from("prayer_plans").update({ prayer_types: plans }).eq("id", existingPlan.id)
      } else {
        // 새 계획 생성
        await supabase.from("prayer_plans").insert({
          user_id: user.id,
          plan_date: planDate,
          prayer_types: plans,
        })
      }
    } catch (error) {
      console.error("기도 계획 저장 오류:", error)
    }
  }

  // 기도 계획 불러오기
  useEffect(() => {
    const loadPrayerPlans = async () => {
      if (isAuthenticated && user) {
        // DB에서 불러오기
        try {
          const planDate = today.toISOString().split("T")[0]
          const { data } = await supabase
            .from("prayer_plans")
            .select("prayer_types")
            .eq("user_id", user.id)
            .eq("plan_date", planDate)
            .single()

          if (data && data.prayer_types) {
            setTodayPlans(data.prayer_types)
          }
        } catch (error) {
          console.error("기도 계획 불러오기 오류:", error)
        }
      } else {
        // 로컬 스토리지에서 불러오기
        const savedPlans = localStorage.getItem("todayPrayerPlans")
        if (savedPlans) {
          setTodayPlans(JSON.parse(savedPlans))
        }
      }
    }

    loadPrayerPlans()
  }, [isAuthenticated, user])

  return (
    <div className="flex flex-col min-h-screen bg-amber-100">
      <SiteHeader />
      <main className="flex-1 py-6">
        <div className="container px-4 md:px-6 max-w-4xl">
          <div className="flex flex-col items-center text-center mb-6 animate-fadeIn">
            <h1 className="text-3xl md:text-4xl font-bold text-amber-900 mb-2">성경 기반 기도 블로그</h1>
            <p className="text-base text-amber-800 max-w-2xl">
              매일 말씀과 함께하는 기도 생활을 통해 영적 성장을 경험하세요
            </p>
          </div>

          <div className="space-y-4">
            {/* 주간 계획 섹션 */}
            <Card className="border-none shadow-lg overflow-hidden animate-fadeIn bg-white rounded-2xl">
              <CardHeader className="bg-amber-50 pb-3">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-amber-600 mr-2" />
                  <CardTitle className="text-amber-900 text-lg">이번 주 기도 계획</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <WeeklyPlan todayPlans={todayPlans} />
              </CardContent>
            </Card>

            {/* 기도 유형 선택 섹션 - 주간 계획 하단에 배치 */}
            <Card className="border-none shadow-lg overflow-hidden animate-fadeIn bg-white rounded-2xl">
              <CardHeader className="bg-amber-50 pb-3">
                <div className="flex items-center">
                  <BookOpen className="h-5 w-5 text-amber-600 mr-2" />
                  <CardTitle className="text-amber-900 text-lg">오늘의 기도 유형</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <p className="text-amber-800 mb-3 text-sm">
                  오늘 드리고 싶은 기도 유형을 선택하세요. 선택한 기도는 주간 계획에 추가됩니다.
                </p>
                <PrayerTypeSelector onSelect={handlePrayerTypeSelect} selectedType={selectedPrayerType} />
              </CardContent>
            </Card>

            {/* 기도문 생성 섹션 */}
            {selectedPrayerType && (
              <Card className="border-none shadow-lg overflow-hidden animate-fadeIn bg-white rounded-2xl">
                <CardHeader className="bg-amber-50 pb-3">
                  <div className="flex items-center">
                    <Sparkles className="h-5 w-5 text-amber-600 mr-2" />
                    <CardTitle className="text-amber-900 text-lg">성경 기반 기도문</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-5">
                  <PrayerGenerator prayerType={selectedPrayerType} />
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
