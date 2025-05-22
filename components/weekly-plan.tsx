"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface WeeklyPlanProps {
  todayPlans: string[]
}

export function WeeklyPlan({ todayPlans }: WeeklyPlanProps) {
  const [currentWeek, setCurrentWeek] = useState<Date[]>([])
  const [today, setToday] = useState<Date>(new Date())
  const [isLoading, setIsLoading] = useState(true)

  // 요일 이름
  const dayNames = ["일", "월", "화", "수", "목", "금", "토"]

  // 현재 주의 날짜 계산
  useEffect(() => {
    try {
      const now = new Date()
      const currentDay = now.getDay() // 0: 일요일, 1: 월요일, ...

      const weekDates = []

      // 일요일부터 시작하는 주의 날짜들 계산
      for (let i = 0; i < 7; i++) {
        const date = new Date(now)
        date.setDate(now.getDate() - currentDay + i)
        weekDates.push(date)
      }

      setCurrentWeek(weekDates)
      setToday(now)
    } catch (error) {
      console.error("날짜 계산 오류:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // 날짜 포맷팅 - null 체크 추가
  const formatDate = (date: Date | undefined) => {
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
      return "--"
    }
    return `${date.getDate()}`
  }

  // 오늘 날짜인지 확인 - null 체크 추가
  const isToday = (date: Date | undefined) => {
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
      return false
    }
    return date.toDateString() === today.toDateString()
  }

  // 지난 날짜인지 확인 - null 체크 추가
  const isPast = (date: Date | undefined) => {
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
      return false
    }
    const todayStart = new Date(today)
    todayStart.setHours(0, 0, 0, 0)
    return date < todayStart
  }

  // 기도 계획 간소화 (예: "부모님을 위한 기도" -> "부모님")
  const simplifyPrayerType = (prayerType: string) => {
    // "자녀를 위한 기도" -> "자녀"
    if (prayerType.includes("자녀")) return "자녀"
    // "부모님을 위한 기도" -> "부모님"
    if (prayerType.includes("부모님")) return "부모님"
    // "배우자를 위한 기도" -> "배우자"
    if (prayerType.includes("배우자")) return "배우자"
    // 그 외 첫 단어만 반환
    return prayerType.split(" ")[0]
  }

  // 로딩 중이거나 데이터가 없는 경우 로딩 UI 표시
  if (isLoading || currentWeek.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center text-amber-800">
            <CalendarDays className="w-5 h-5 mr-2" />
            <span className="font-medium">이번 주 기도 계획</span>
          </div>
          <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200 border-amber-300">로딩 중...</Badge>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {Array(7)
            .fill(null)
            .map((_, index) => (
              <div key={index} className="rounded-xl overflow-hidden shadow-sm bg-gray-50 animate-pulse">
                <div className="text-center py-2 bg-amber-100">
                  <div className="font-medium">{dayNames[index]}</div>
                  <div className="text-xs opacity-80">--</div>
                </div>
                <div className="p-2 min-h-[60px]"></div>
              </div>
            ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-7 gap-2">
        {currentWeek.map((date, index) => {
          const isCurrentDay = isToday(date)
          const isPastDay = isPast(date)

          return (
            <div
              key={index}
              className={cn(
                "rounded-xl overflow-hidden transition-all duration-200 text-center card-mystical",
                isCurrentDay
                  ? "ring-2 ring-amber-400 bg-amber-50 animate-pulse-soft"
                  : isPastDay
                    ? "bg-white opacity-75"
                    : "bg-white",
              )}
            >
              <div className={cn("py-2", isCurrentDay ? "bg-amber-200 text-amber-900" : "bg-amber-50 text-amber-800")}>
                <div className="text-xs opacity-80">{dayNames[index]}</div>
                <div className="font-bold text-lg">{formatDate(date)}</div>
              </div>

              <div className="p-1 min-h-[60px]">
                {isCurrentDay ? (
                  todayPlans.length > 0 ? (
                    <div className="space-y-1 p-1">
                      {todayPlans.map((plan, i) => (
                        <div
                          key={i}
                          className="flex items-center text-xs bg-white rounded-md p-1 border border-amber-100 animate-shimmer"
                        >
                          <CheckCircle2 className="w-3 h-3 text-amber-600 mr-1 flex-shrink-0" />
                          <span className="truncate text-amber-800 text-xs">{simplifyPrayerType(plan)}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-xs text-amber-600">기도 선택</p>
                    </div>
                  )
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-xs text-amber-400">{isPastDay ? "완료" : "예정"}</p>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
