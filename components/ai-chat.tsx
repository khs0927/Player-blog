"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Loader2, Send } from "lucide-react"

interface AiChatProps {
  initialPrompt?: string
  prayerContext?: any
}

interface Message {
  role: "user" | "assistant"
  content: string
}

export function AiChat({ initialPrompt, prayerContext }: AiChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // 한자 오류 처리 함수
  const sanitizeText = (text: string) => {
    if (!text) return ""
    // 한자를 포함한 텍스트를 안전하게 처리
    return text.replace(/[\u4E00-\u9FFF]/g, (char) => {
      // 한자를 한글로 대체하거나 그대로 유지
      const charMap: Record<string, string> = {
        耶: "예",
        穌: "수",
        天: "천",
        國: "국",
      }
      return charMap[char] || char
    })
  }

  // 초기 메시지 설정
  useEffect(() => {
    if (initialPrompt) {
      const initialMessages: Message[] = [{ role: "user", content: initialPrompt }]
      setMessages(initialMessages)
      handleSendMessage(initialPrompt, true)
    } else {
      // 초기 인사 메시지
      setMessages([
        {
          role: "assistant",
          content:
            "안녕하세요! 성경 기반 기도와 묵상에 관한 질문이 있으시면 언제든지 물어보세요. 어떤 도움이 필요하신가요?",
        },
      ])
    }
  }, [initialPrompt])

  // 메시지 스크롤 자동 이동
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async (message: string, isInitial = false) => {
    if (!message.trim() && !isInitial) return

    try {
      setIsLoading(true)

      // 초기 메시지가 아닌 경우에만 사용자 메시지 추가
      if (!isInitial) {
        setMessages((prev) => [...prev, { role: "user", content: message }])
        setInput("")
      }

      // AI 응답 생성 요청
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          prayerContext,
          history: messages,
        }),
      })

      if (!response.ok) {
        throw new Error("AI 응답 생성에 실패했습니다.")
      }

      const data = await response.json()

      // AI 응답 추가
      setMessages((prev) => [...prev, { role: "assistant", content: sanitizeText(data.response) }])
    } catch (error) {
      console.error("AI 채팅 오류:", error)

      // 오류 발생 시 기본 응답
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "죄송합니다. 응답을 생성하는 중 오류가 발생했습니다. 다시 시도해 주세요.",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-[500px] card-mystical">
      <div className="flex-1 overflow-y-auto p-4 bg-white rounded-t-xl">
        {messages.length === 0 ? (
          <div className="text-center py-8 text-amber-600">
            <p>AI 도우미에게 질문해보세요.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`flex max-w-[80%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                  <div className={`flex-shrink-0 ${msg.role === "user" ? "ml-2" : "mr-2"}`}>
                    <Avatar className="h-8 w-8 animate-pulse-soft">
                      {msg.role === "assistant" ? (
                        <>
                          <AvatarImage src="/placeholder.svg?height=32&width=32" alt="AI" />
                          <AvatarFallback className="bg-amber-100 text-amber-800">AI</AvatarFallback>
                        </>
                      ) : (
                        <>
                          <AvatarImage src="/placeholder.svg?height=32&width=32" alt="사용자" />
                          <AvatarFallback className="bg-amber-500 text-white">나</AvatarFallback>
                        </>
                      )}
                    </Avatar>
                  </div>
                  <div
                    className={`p-3 rounded-xl ${
                      msg.role === "user"
                        ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-tr-none animate-shimmer"
                        : "bg-gradient-to-r from-amber-100 to-amber-200 text-amber-900 rounded-tl-none animate-shimmer"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex max-w-[80%] flex-row">
                  <div className="mr-2 flex-shrink-0">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder.svg?height=32&width=32" alt="AI" />
                      <AvatarFallback className="bg-amber-100 text-amber-800">AI</AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="p-3 rounded-xl bg-amber-100 text-amber-900 rounded-tl-none">
                    <Loader2 className="h-5 w-5 animate-spin" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <div className="p-3 border-t border-amber-100 bg-gradient-to-r from-amber-50 to-amber-100 rounded-b-xl">
        <div className="flex space-x-2">
          <Textarea
            placeholder="메시지를 입력하세요..."
            className="min-h-[60px] border-amber-200 bg-white"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSendMessage(input)
              }
            }}
          />
          <Button
            onClick={() => handleSendMessage(input)}
            className="btn-primary self-end h-10 w-10 p-2 rounded-full animate-pulse-soft"
            disabled={isLoading || !input.trim()}
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
