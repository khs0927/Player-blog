"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"

const formSchema = z.object({
  email: z.string().email({
    message: "유효한 이메일 주소를 입력해주세요.",
  }),
  password: z.string().min(6, {
    message: "비밀번호는 최소 6자 이상이어야 합니다.",
  }),
})

export default function LoginPage() {
  const { signIn, isAuthenticated } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectPath = searchParams.get("redirect") || "/dashboard"
  const [isLoading, setIsLoading] = useState(false)
  const [loginError, setLoginError] = useState<string | null>(null)
  const [loginSuccess, setLoginSuccess] = useState(false)

  // 인증 상태가 변경되면 리다이렉션
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      console.log("User is authenticated, redirecting to:", redirectPath)
      window.location.href = redirectPath // 강제 리다이렉션
    }
  }, [isAuthenticated, isLoading, redirectPath])

  // 로그인 성공 후 리다이렉션
  useEffect(() => {
    if (loginSuccess) {
      console.log("Login success, redirecting to:", redirectPath)

      // 강제 리다이렉션
      const redirectTimer = setTimeout(() => {
        window.location.href = redirectPath
      }, 1000)

      return () => clearTimeout(redirectTimer)
    }
  }, [loginSuccess, redirectPath])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true)
      setLoginError(null)

      const { success, error } = await signIn(values.email, values.password)

      if (success) {
        setLoginSuccess(true)
        toast({
          title: "로그인 성공",
          description: "환영합니다! 대시보드로 이동합니다.",
        })

        // 강제 리다이렉션
        console.log("Forcing redirect to:", redirectPath)
        setTimeout(() => {
          window.location.href = redirectPath
        }, 1000)
      } else {
        setLoginError(error?.message || "로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.")
        toast({
          title: "로그인 실패",
          description: error?.message || "이메일 또는 비밀번호를 확인해주세요.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Login error:", error)
      setLoginError("로그인 중 오류가 발생했습니다. 다시 시도해주세요.")
      toast({
        title: "로그인 오류",
        description: "로그인 중 오류가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container flex items-center justify-center min-h-screen py-12">
      <Card className="w-full max-w-md border-amber-200">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-amber-900">로그인</CardTitle>
          <CardDescription className="text-center">계정에 로그인하여 기도와 묵상을 기록하세요.</CardDescription>
        </CardHeader>
        <CardContent>
          {loginError && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{loginError}</AlertDescription>
            </Alert>
          )}

          {loginSuccess ? (
            <Alert className="mb-4 bg-green-50 border-green-200 text-green-800">
              <AlertDescription>로그인 성공! 대시보드로 이동합니다...</AlertDescription>
            </Alert>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>이메일</FormLabel>
                      <FormControl>
                        <Input placeholder="your@email.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>비밀번호</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="******" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700" disabled={isLoading}>
                  {isLoading ? "로그인 중..." : "로그인"}
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-center text-sm">
            계정이 없으신가요?{" "}
            <Link href="/auth/register" className="text-amber-600 hover:text-amber-800 font-medium">
              회원가입
            </Link>
          </div>
          {loginSuccess && (
            <Button
              onClick={() => {
                window.location.href = redirectPath
              }}
              className="mt-2 w-full bg-amber-600 hover:bg-amber-700"
            >
              지금 대시보드로 이동
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
