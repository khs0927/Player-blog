"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/auth-context"

export function MainNav() {
  const pathname = usePathname()
  const { isAuthenticated } = useAuth()

  const routes = [
    {
      href: "/",
      label: "홈",
      active: pathname === "/",
    },
    {
      href: "/prayers",
      label: "기도",
      active: pathname === "/prayers" || pathname.startsWith("/prayers/"),
    },
    {
      href: "/meditations",
      label: "묵상",
      active: pathname === "/meditations" || pathname.startsWith("/meditations/"),
    },
    {
      href: "/blog",
      label: "블로그",
      active: pathname === "/blog" || pathname.startsWith("/blog/"),
    },
    {
      href: "/dashboard",
      label: "대시보드",
      active: pathname === "/dashboard",
      authRequired: true,
    },
  ]

  return (
    <nav className="flex items-center space-x-6 text-sm font-medium">
      {routes.map((route) => {
        // 인증이 필요한 경로이고 인증되지 않은 경우 표시하지 않음
        if (route.authRequired && !isAuthenticated) {
          return null
        }

        return (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "transition-colors hover:text-amber-900",
              route.active ? "text-amber-900 font-semibold" : "text-amber-700",
            )}
          >
            {route.label}
          </Link>
        )
      })}

      {!isAuthenticated ? (
        <div className="flex items-center space-x-4">
          <Link href="/auth/login" className="text-amber-700 hover:text-amber-900 transition-colors">
            로그인
          </Link>
          <Link
            href="/auth/register"
            className="bg-amber-500 text-white px-3 py-1.5 rounded-md hover:bg-amber-600 transition-colors"
          >
            회원가입
          </Link>
        </div>
      ) : null}
    </nav>
  )
}
