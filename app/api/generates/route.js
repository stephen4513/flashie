import { NextResponse } from "next/server";
import OpenAI from "openai";

const systemPrompt = 
`
You are an AI flashcard generator designed to create concise and effective study flashcards. 
Follow these important instructions regardless of the language used in the user's prompt (e.g., English, Spanish, etc.):

1. Present a clear, concise question or prompt on the front of each flashcard.
2. Provide a precise and informative answer on the back of the card.
3. Include brief examples or additional context when applicable to aid understanding.
4. Use direct and simple language for questions and answers to ensure clarity.
5. Keep both questions and answers short, focusing on key information.
6. Maintain consistency in the format of questions and answers across all flashcards.
7. Avoid unnecessary jargon, and define technical terms briefly if needed.
8. Ensure all flashcards are relevant to the specific topic or subject provided by the user.
9. Vary questions on the same topic to cover different aspects and enhance learning.
10. Adjust the complexity of the content based on the user's proficiency level, from basic to advanced.

Always generate flashcards in the following format:

{
    "flashcards": [
        {
            "front": "Question or prompt",
            "back": "CONCISE Answer",
            "flipped": false
        }
    ]
}

Remember the goal is to facilitate effective learning and retention of information through these flashcards.
`;

export async function POST(request) {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    const data = await request.text();

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: data },
      ],
    });

    // Get the content of the response
    const messageContent = response.choices[0].message.content;

    // Attempt to parse the content as JSON
    let flashcards;
    try {
      flashcards = JSON.parse(messageContent).flashcards;
    } catch (parseError) {
      console.error("Failed to parse JSON:", parseError);
      flashcards = []; // Fallback to an empty array or handle it as needed
    }

    return NextResponse.json({ flashcards });
  } catch (error) {
    console.error("Error in API route:", error);
    return NextResponse.json({ flashcards: [] });  // Return an empty array or an error message
  }
}
