"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Plus, Calendar, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { SiteHeader } from "@/components/site-header"
import { useAuth } from "@/contexts/auth-context"
import { formatDistanceToNow } from "date-fns"
import { ko } from "date-fns/locale"

export default function BlogPage() {
  const [posts, setPosts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true)

        // 복음 중심의 테스트 데이터
        const testPosts = [
          {
            id: "post-1",
            title: "그리스도 안에서의 참된 자유",
            content: `"그러므로 이제 그리스도 예수 안에 있는 자에게는 결코 정죄함이 없나니"(롬 8:1). 우리는 자신의 노력과 행위로 구원을 얻으려 하지만, 복음의 핵심은 우리가 아닌 그리스도께서 우리 안에 사시는 것입니다. 우리의 지혜와 능력이 아닌, 오직 주님의 지혜와 능력으로 살아갈 때 참된 자유를 경험하게 됩니다. 내가 죽고 그리스도께서 내 안에 사시는 삶이 진정한 복음의 삶입니다.`,
            author: "김목사",
            created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
          },
          {
            id: "post-2",
            title: "내 안에 거하시는 그리스도",
            content: `"내가 그리스도와 함께 십자가에 못 박혔나니 그런즉 이제는 내가 사는 것이 아니요 오직 내 안에 그리스도께서 사시는 것이라"(갈 2:20). 복음의 핵심은 내가 아닌 그리스도께서 내 안에 사시는 것입니다. 우리의 삶이 우리 자신의 것이 아니라 그리스도의 것임을 인정할 때, 우리는 참된 평안과 기쁨을 경험하게 됩니다. 주님의 뜻을 구하고 주님의 지혜로 살아가는 삶이 진정한 그리스도인의 삶입니다.`,
            author: "이집사",
            created_at: new Date(Date.now() - 86400000 * 6).toISOString(),
          },
          {
            id: "post-3",
            title: "주님의 뜻을 구하는 삶",
            content: `"너희는 이 세대를 본받지 말고 오직 마음을 새롭게 함으로 변화를 받아 하나님의 선하시고 기뻐하시고 온전하신 뜻이 무엇인지 분별하도록 하라"(롬 12:2). 우리는 종종 자신의 뜻과 계획을 따라 살아가려 합니다. 그러나 복음은 우리에게 자신을 내려놓고 주님의 뜻을 구하라고 가르칩니다. 내 지혜가 아닌 주님의 지혜를 구하고, 내 뜻이 아닌 주님의 뜻이 이루어지기를 구할 때, 우리는 참된 제자의 삶을 살게 됩니다.`,
            author: "박권사",
            created_at: new Date(Date.now() - 86400000 * 9).toISOString(),
          },
          {
            id: "post-4",
            title: "성령의 인도하심을 따라",
            content: `"만일 너희가 성령의 인도하시는 바가 되면 율법 아래에 있지 아니하리라"(갈 5:18). 복음의 핵심은 율법의 행위가 아닌 성령의 인도하심을 따라 사는 것입니다. 우리 자신의 노력이 아닌, 우리 안에 거하시는 성령님의 능력으로 살아갈 때 우리는 참된 변화를 경험하게 됩니다. 내가 아닌 내 안에 계신 성령님께서 나를 통해 일하시도록 자신을 내어드리는 삶이 진정한 그리스도인의 삶입니다.`,
            author: "최장로",
            created_at: new Date(Date.now() - 86400000 * 12).toISOString(),
          },
          {
            id: "post-5",
            title: "그리스도 안에서의 새로운 피조물",
            content: `"그런즉 누구든지 그리스도 안에 있으면 새로운 피조물이라 이전 것은 지나갔으니 보라 새 것이 되었도다"(고후 5:17). 복음은 우리에게 새로운 정체성을 줍니다. 더 이상 죄와 율법 아래 있지 않고, 그리스도 안에서 새로운 피조물이 된 우리는 이제 주님의 영광을 위해 살아갑니다. 내 안에 그리스도께서 사시고, 그분의 뜻과 지혜로 살아갈 때 우리는 참된 변화와 성장을 경험하게 됩니다.`,
            author: "정집사",
            created_at: new Date(Date.now() - 86400000 * 15).toISOString(),
          },
        ]

        setPosts(testPosts)
      } catch (err) {
        console.error("Error fetching blog posts:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPosts()
  }, [])

  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-1 py-8">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-amber-900">블로그</h1>
              <p className="text-amber-800 mt-1">복음 중심의 묵상과 기도를 나눕니다.</p>
            </div>
            {isAuthenticated && (
              <Button asChild className="mt-4 md:mt-0 btn-primary">
                <Link href="/blog/new">
                  <Plus className="mr-2 h-4 w-4" />새 글 작성
                </Link>
              </Button>
            )}
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-amber-800">블로그 글을 불러오고 있습니다...</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <Card key={post.id} className="border-none shadow-lg overflow-hidden flex flex-col card-mystical">
                  <CardHeader className="pb-3 bg-amber-50 rounded-t-2xl">
                    <CardTitle className="text-xl text-amber-900 line-clamp-2">{post.title}</CardTitle>
                    <CardDescription className="flex items-center text-xs">
                      <User className="h-3 w-3 mr-1" />
                      {post.author}
                      <span className="mx-2">•</span>
                      <Calendar className="h-3 w-3 mr-1" />
                      {formatDistanceToNow(new Date(post.created_at), { addSuffix: true, locale: ko })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-4 flex-1">
                    <p className="text-amber-800 line-clamp-3">{post.content}</p>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button
                      asChild
                      variant="outline"
                      className="w-full border-amber-200 text-amber-800 hover:bg-amber-100"
                    >
                      <Link href={`/blog/${post.id}`}>계속 읽기</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
