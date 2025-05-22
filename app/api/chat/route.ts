import { NextResponse } from "next/server"
import { groq } from "@ai-sdk/groq"
import { generateText } from "ai"

export async function POST(req: Request) {
  try {
    const { message, prayerContext, history } = await req.json()

    if (!message) {
      return NextResponse.json({ error: "메시지가 필요합니다." }, { status: 400 })
    }

    // 기도 컨텍스트 정보 추출
    const contextInfo = prayerContext
      ? `
기도 제목: ${prayerContext.title}
기도 내용: ${prayerContext.content}
성경 구절: ${prayerContext.scripture || "없음"}
대상 카테고리: ${prayerContext.target_category}
주제 카테고리: ${prayerContext.topic_category}
`
      : ""

    // 이전 대화 내역 포맷팅
    const chatHistory = history
      ? history.map((msg: any) => `${msg.role === "user" ? "사용자" : "AI"}: ${msg.content}`).join("\n\n")
      : ""

    const prompt = `
당신은 성경 기반 기도와 묵상을 도와주는 기독교 AI 도우미입니다.
사용자의 질문에 친절하고 도움이 되는 답변을 제공해주세요.

${contextInfo ? "다음은 현재 기도 컨텍스트입니다:\n" + contextInfo : ""}

${chatHistory ? "이전 대화 내역:\n" + chatHistory + "\n\n" : ""}

사용자의 질문: ${message}

답변 시 다음 사항을 지켜주세요:
1. 성경적 관점에서 답변하되, 개역개정 4판을 기준으로 성경 구절을 인용해주세요.
2. 친절하고 공감하는 어투를 사용하세요.
3. 필요한 경우 성경 구절을 인용하여 답변을 뒷받침해주세요.
4. 사용자의 영적 성장을 돕는 실질적인 조언을 제공해주세요.
5. 답변은 반드시 한글로 작성해주세요.
6. 영어 표현이나 문장을 사용하지 마세요.
`

    const { text } = await generateText({
      model: groq("llama3-70b-8192"),
      prompt,
      temperature: 0.7,
      maxTokens: 1000,
    })

    return NextResponse.json({ response: text })
  } catch (error) {
    console.error("AI 채팅 오류:", error)
    return NextResponse.json({ error: "AI 응답 생성 중 오류가 발생했습니다." }, { status: 500 })
  }
}
