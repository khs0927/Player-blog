import { NextResponse } from "next/server"
import { groq } from "@ai-sdk/groq"
import { generateText } from "ai"

export async function POST(req: Request) {
  try {
    const { prayer } = await req.json()

    if (!prayer) {
      return NextResponse.json({ error: "기도문 정보가 필요합니다." }, { status: 400 })
    }

    const prompt = `
당신은 성경 말씀을 기반으로 묵상 내용을 작성해주는 기독교 묵상 도우미입니다.
다음 기도문과 성경 구절을 바탕으로 묵상 내용을 작성해주세요.

기도 제목: ${prayer.title}
기도 내용: ${prayer.content}
성경 구절: ${prayer.scripture || "없음"}
대상 카테고리: ${prayer.target_category}
주제 카테고리: ${prayer.topic_category}

묵상 내용은 다음과 같은 특징을 가져야 합니다:
1. 성경 구절의 의미와 적용점을 설명해주세요.
2. 기도문의 내용과 연결하여 영적 통찰을 제공해주세요.
3. 실제 삶에 적용할 수 있는 구체적인 묵상 포인트를 3가지 정도 제시해주세요.
4. 개역개정 4판을 기준으로 성경 구절을 인용해주세요.
5. 한글로 작성하고, 일상적인 어투를 사용해주세요.
6. 약 400-600자 정도의 분량으로 작성해주세요.

묵상 내용 예시:
"잠언 22:6의 말씀은 자녀 교육의 중요성을 강조합니다. '마땅히 행할 길을 아이에게 가르치라 그리하면 늙어도 그것을 떠나지 아니하리라'는 말씀은 어린 시절의 가르침이 평생 영향을 미친다는 것을 보여줍니다.

자녀를 위한 기도에서 중요한 점은 단순히 자녀의 성공이나 행복만을 구하는 것이 아니라, 하나님의 말씀 안에서 바른 길을 걷도록 인도해 달라고 구하는 것입니다. 이는 자녀가 하나님을 경외하고 그분의 뜻을 따르는 삶을 살도록 돕는 것을 의미합니다.

이 기도를 통해 우리는 자녀의 영적 성장을 위해 기도하는 부모의 마음을 볼 수 있습니다. 자녀가 세상의 유혹에 흔들리지 않고 믿음 안에서 강건하게 자라나길 바라는 마음이 담겨 있습니다.

묵상 포인트:
1. 나는 자녀(또는 내 주변의 어린이들)에게 어떤 영적 가르침을 주고 있는가?
2. 자녀의 성공보다 하나님과의 관계를 더 중요시하고 있는가?
3. 자녀가 하나님의 말씀을 따르도록 어떻게 도울 수 있을까?"
`

    const { text } = await generateText({
      model: groq("llama3-70b-8192"),
      prompt,
      temperature: 0.7,
      maxTokens: 1500,
    })

    return NextResponse.json({ meditation: text })
  } catch (error) {
    console.error("묵상 생성 오류:", error)
    return NextResponse.json({ error: "묵상 생성 중 오류가 발생했습니다." }, { status: 500 })
  }
}
