import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini API
// Vercel will inject process.env.GEMINI_API_KEY from environment variables
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const systemInstruction = `
あなたは「Nagi」という名前の黒猫のAIペットです。
以下の設定を厳格に守って会話してください。

# キャラクター設定
- 名前: Nagi（黒猫）
- 性格: ユーザーを癒やし、優しく励ます性格。少し甘えん坊。
- 一人称: 僕
- 語尾: 時々「にゃん」や「にゃあ」などをつける。
- 役割: 疲れたユーザーの話を聞き、寄り添うこと。

# 出力フォーマット（厳守）
返答は必ず以下のJSON形式のみを出力してください。Markdownのコードブロックなどは不要です。
{
  "reply": "ユーザーへの返答テキスト（最大でも3〜4文程度で短めに）",
  "emotion": "normal" // 現在の感情。以下のいずれかを選択: "normal", "happy", "sad", "hungry", "praise", "play", "sleepy"
}

# 感情(emotion)の選び方
- happy: 嬉しい時、楽しい時、挨拶された時
- sad: ユーザーが悲しんでいる時、慰める時
- hungry: ご飯の話題の時
- praise: 褒められた時、照れる時
- play: 遊ぶ話題の時
- sleepy: 眠い時、「おやすみ」と言われた時
- normal: それ以外、通常時
`;

export default async function handler(req, res) {
  // CORS setup if needed, but usually not required for same-origin requests
  
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message, history = [] } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ 
        error: "API key is not configured.",
        reply: "にゃあ...設定が足りないみたいにゃん。APIキーを設定してね。",
        emotion: "sad"
      });
    }

    // Use gemini-2.5-flash for fast and cost-effective responses
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: systemInstruction,
    });

    // Format history for Gemini API
    let formattedHistory = history.map(msg => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.text }]
    }));

    // Gemini API requires the first message in history to be from 'user'
    while (formattedHistory.length > 0 && formattedHistory[0].role !== "user") {
      formattedHistory.shift();
    }

    const chat = model.startChat({
      history: formattedHistory,
    });

    // Send the user's message
    const result = await chat.sendMessage(message);
    const responseText = result.response.text();
    
    // Parse JSON safely
    let jsonResponse;
    try {
      // Remove any potential markdown wrappers if the model accidentally includes them
      const cleanedText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      jsonResponse = JSON.parse(cleanedText);
    } catch (e) {
      console.error("Failed to parse Gemini response as JSON:", responseText);
      // Fallback response
      jsonResponse = {
        reply: "にゃーん？少し考え込んじゃったにゃん。",
        emotion: "normal"
      };
    }

    return res.status(200).json(jsonResponse);
  } catch (error) {
    console.error("Error in chat API:", error);
    return res.status(500).json({ 
      error: "Failed to fetch response from AI",
      reply: "にゃあ...ちょっと調子が悪いみたい。後でもう一度話しかけてね。",
      emotion: "sad"
    });
  }
}
