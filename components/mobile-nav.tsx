"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Book, Calendar, Home, Menu, MessageCircle, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useAuth } from "@/contexts/auth-context"

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { user, signOut } = useAuth()

  const routes = [
    {
      href: "/",
      label: "홈",
      icon: Home,
      active: pathname === "/",
    },
    {
      href: "/prayers",
      label: "기도",
      icon: MessageCircle,
      active: pathname === "/prayers" || pathname.startsWith("/prayers/"),
    },
    {
      href: "/meditations",
      label: "묵상",
      icon: Book,
      active: pathname === "/meditations" || pathname.startsWith("/meditations/"),
    },
    {
      href: "/blog",
      label: "블로그",
      icon: FileText,
      active: pathname === "/blog" || pathname.startsWith("/blog/"),
    },
    {
      href: "/dashboard",
      label: "대시보드",
      icon: Calendar,
      active: pathname === "/dashboard",
      authRequired: true,
    },
  ]

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" className="md:hidden" size="icon">
          <Menu className="h-5 w-5" />
          <span className="sr-only">메뉴 열기</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="pr-0">
        <div className="px-7">
          <Link href="/" className="flex items-center" onClick={() => setOpen(false)}>
            <span className="font-bold text-lg">성경기반 기도</span>
          </Link>
        </div>
        <nav className="flex flex-col gap-4 px-7 mt-10">
          {routes.map((route) => {
            if (route.authRequired && !user) {
              return null
            }

            return (
              <Link
                key={route.href}
                href={route.href}
                onClick={() => setOpen(false)}
                className={`flex items-center py-2 text-sm font-medium transition-colors hover:text-amber-900 ${
                  route.active ? "text-amber-900" : "text-amber-700"
                }`}
              >
                <route.icon className="w-4 h-4 mr-2" />
                {route.label}
              </Link>
            )
          })}

          {!user ? (
            <div className="flex flex-col gap-2 mt-4">
              <Button asChild variant="outline" className="w-full" onClick={() => setOpen(false)}>
                <Link href="/auth/login">로그인</Link>
              </Button>
              <Button
                asChild
                className="w-full bg-amber-500 hover:bg-amber-600 text-white"
                onClick={() => setOpen(false)}
              >
                <Link href="/auth/register">회원가입</Link>
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              className="mt-4 w-full"
              onClick={() => {
                signOut()
                setOpen(false)
              }}
            >
              로그아웃
            </Button>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  )
}
