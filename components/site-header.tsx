"use client"

import Link from "next/link"
import { MainNav } from "@/components/main-nav"
import { MobileNav } from "@/components/mobile-nav"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function SiteHeader() {
  const { isAuthenticated, signOut, user } = useAuth()

  return (
    <header className="sticky top-0 z-40 w-full border-b border-amber-200 bg-white backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:bg-gray-900/95 dark:border-gray-800">
      <div className="container flex h-14 items-center">
        <Link href="/" className="flex items-center space-x-2">
          <span className="font-bold text-lg text-amber-800 dark:text-amber-500">성경기반 기도</span>
        </Link>
        <div className="hidden md:flex md:flex-1 md:justify-center">
          <MainNav />
        </div>
        <div className="flex flex-1 items-center justify-end space-x-3">
          {isAuthenticated ? (
            <Avatar className="h-8 w-8 border-2 border-amber-200">
              <AvatarImage src="/placeholder.svg?height=32&width=32" alt={user?.email || "사용자"} />
              <AvatarFallback className="bg-amber-100 text-amber-800">
                {user?.email?.substring(0, 2).toUpperCase() || "사용자"}
              </AvatarFallback>
            </Avatar>
          ) : (
            <Button asChild size="sm" className="bg-amber-500 hover:bg-amber-600 text-white">
              <Link href="/auth/login">로그인</Link>
            </Button>
          )}
          <MobileNav />
        </div>
      </div>
    </header>
  )
}
