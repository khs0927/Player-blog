import { NextResponse } from "next/server"
import { groq } from "@ai-sdk/groq"
import { generateText } from "ai"

export async function POST(req: Request) {
  try {
    const { prayerType } = await req.json()

    if (!prayerType) {
      return NextResponse.json({ error: "기도 유형이 필요합니다." }, { status: 400 })
    }

    const prompt = `
당신은 성경 말씀을 기반으로 한국어 기도문을 작성해주는 기독교 기도 도우미입니다.
"${prayerType}"에 관한 기도문을 작성해주세요.

다음 형식으로 응답해주세요:
1. 성경 구절: 관련된 성경 구절을 하나 선택하여 장, 절과 함께 제시해주세요. 개역개정 4판 한글 성경 구절을 사용하세요.
2. 기도문: 200-300자 내외의 한국어 기도문을 작성해주세요. 한국 기독교 문화에 맞는 경건한 표현을 사용하세요.

기도문은 다음과 같은 특징을 가져야 합니다:
- 복음의 핵심을 담을 것: 내가 아닌 주님이 나를 통해 일하시고, 내 안에 주님이 임재하시는 내용
- 자신의 지혜가 아닌 주님의 지혜와 뜻을 구하는 내용을 담을 것
- 자신을 내려놓고 주님만을 높이는 내용을 담을 것
- "해주세요", "도와주세요"와 같은 일상적인 존칭 표현을 사용할 것
- 성경적 표현과 내용을 담을 것
- 선택한 성경 구절의 내용을 기도문에 자연스럽게 반영할 것
- 경건하고 진실된 마음을 담을 것
- 한국 기독교인들이 일상에서 사용할 수 있는 실제적인 기도문일 것
- 한자어가 아닌 순 한글 표현을 사용할 것
- 영어 표현이나 문장을 절대 사용하지 말 것
- 반드시 한글로만 작성할 것

기도문 예시:
"하나님 아버지, 제 지혜가 아닌 주님의 지혜로 자녀들을 인도하게 하소서. 제 안에 주님이 임재하셔서 자녀들을 주님의 뜻대로 양육할 수 있게 하소서. 저의 생각과 방법이 아닌, 오직 주님의 말씀에 따라 자녀들을 가르치게 하시고, 제가 먼저 주님 안에서 온전히 변화되어 자녀들에게 본이 되게 하소서. 자녀들이 이 세상의 가치관이 아닌 하나님 나라의 가치관으로 자라나게 하시고, 그들 안에 주님이 거하시어 주님의 뜻을 이루는 도구로 사용되게 하소서. 예수님의 이름으로 기도합니다. 아멘."
`

    const { text } = await generateText({
      model: groq("llama3-70b-8192"),
      prompt,
      temperature: 0.7,
      maxTokens: 1000,
    })

    // 응답 파싱
    let scripture = ""
    let prayer = ""

    if (text.includes("성경 구절:")) {
      const parts = text.split(/기도문:|성경 구절:/)
      scripture = parts[1]?.trim() || ""
      prayer = parts[2]?.trim() || ""
    } else {
      prayer = text
    }

    // 한자 제거 및 한글로 변환
    const sanitizeText = (text: string) => {
      if (!text) return ""
      // 한자를 한글로 변환
      return text
        .replace(/耶穌/g, "예수")
        .replace(/天國/g, "천국")
        .replace(/耶/g, "예")
        .replace(/穌/g, "수")
        .replace(/天/g, "천")
        .replace(/國/g, "국")
    }

    scripture = sanitizeText(scripture)
    prayer = sanitizeText(prayer)

    // "하소서"를 "해주세요"로 변경
    prayer = prayer.replace(/하소서/g, "해주세요")
    prayer = prayer.replace(/주소서/g, "주세요")
    prayer = prayer.replace(/되소서/g, "되게 해주세요")
    prayer = prayer.replace(/하옵소서/g, "해주세요")
    prayer = prayer.replace(/주시옵소서/g, "주세요")
    prayer = prayer.replace(/되옵소서/g, "되게 해주세요")

    return NextResponse.json({ prayer, scripture })
  } catch (error) {
    console.error("기도문 생성 오류:", error)
    return NextResponse.json({ error: "기도문 생성 중 오류가 발생했습니다." }, { status: 500 })
  }
}
