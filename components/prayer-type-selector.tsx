"use client"

import {
  Heart,
  Users,
  ThumbsUp,
  DotIcon as Dove,
  Cross,
  Compass,
  Stethoscope,
  Dumbbell,
  Brain,
  Shield,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface PrayerTypeSelectorProps {
  onSelect: (type: string) => void
  selectedType: string | null
}

export function PrayerTypeSelector({ onSelect, selectedType }: PrayerTypeSelectorProps) {
  const prayerTypes = [
    { id: "children", label: "자녀를 위한 기도", icon: Users },
    { id: "parents", label: "부모님을 위한 기도", icon: Heart },
    { id: "gratitude", label: "감사 기도", icon: ThumbsUp },
    { id: "forgiveness", label: "용서 기도", icon: Dove },
    { id: "presence", label: "주님의 임재 기도", icon: Cross },
    { id: "guidance", label: "인도하심 기도", icon: Compass },
    { id: "healing", label: "치유 기도", icon: Stethoscope },
    { id: "strength", label: "힘과 용기 기도", icon: Dumbbell },
    { id: "wisdom", label: "지혜 기도", icon: Brain },
    { id: "protection", label: "보호 기도", icon: Shield },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
      {prayerTypes.map((type) => {
        const isSelected = selectedType === type.label
        const Icon = type.icon

        return (
          <button
            key={type.id}
            className={cn(
              "flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200",
              isSelected ? "bg-amber-200 text-amber-900 shadow-md" : "bg-amber-50 text-amber-800 hover:bg-amber-100",
            )}
            onClick={() => onSelect(type.label)}
          >
            <div
              className={cn(
                "flex items-center justify-center w-8 h-8 rounded-full mb-1",
                isSelected ? "bg-amber-300 text-amber-900" : "bg-white text-amber-600",
              )}
            >
              <Icon className="w-4 h-4" />
            </div>
            <span className="text-xs text-center font-medium line-clamp-2">{type.label}</span>
          </button>
        )
      })}
    </div>
  )
}
