"use client"

import { useState } from "react"
import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SiteHeader } from "@/components/site-header"
import { PrayersList } from "@/components/prayers-list"
import { PrayerCategories } from "@/components/prayer-categories"
import { useAuth } from "@/contexts/auth-context"

export default function PrayersPage() {
  const [selectedTargetCategory, setSelectedTargetCategory] = useState<string | null>(null)
  const [selectedTopicCategory, setSelectedTopicCategory] = useState<string | null>(null)
  const { isAuthenticated, user } = useAuth()

  // 카테고리 선택 핸들러
  const handleCategorySelect = (type: "target" | "topic", category: string | null) => {
    if (type === "target") {
      setSelectedTargetCategory(category)
    } else {
      setSelectedTopicCategory(category)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-amber-100">
      <SiteHeader />
      <main className="flex-1 py-6">
        <div className="container px-4 md:px-6 max-w-4xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-amber-900">기도 목록</h1>
              <p className="text-amber-800 mt-1">나의 기도를 기록하고 응답을 기다립니다.</p>
            </div>
            <Button asChild className="mt-4 md:mt-0 bg-amber-500 hover:bg-amber-600 text-white">
              <Link href="/prayers/new">
                <Plus className="mr-2 h-4 w-4" />새 기도 기록
              </Link>
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-12">
            <div className="md:col-span-3">
              <PrayerCategories
                selectedTargetCategory={selectedTargetCategory}
                selectedTopicCategory={selectedTopicCategory}
                onSelectCategory={handleCategorySelect}
              />
            </div>
            <div className="md:col-span-9">
              <PrayersList
                userId={user?.id || "guest"}
                targetCategory={selectedTargetCategory}
                topicCategory={selectedTopicCategory}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
