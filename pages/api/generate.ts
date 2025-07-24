import type { NextApiRequest, NextApiResponse } from "next";
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { topic } = req.body;
  if (!topic || topic.trim() === "") {
    return res.status(400).json({ error: "Topik tidak boleh kosong" });
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      temperature: 1.2,
      top_p: 0.95,
      presence_penalty: 0.5,
      frequency_penalty: 0.2,
      messages: [
        {
          role: "system",
          content: `
Kamu adalah penulis artikel profesional dan kreatif. Tulis artikel panjang berbentuk HTML lengkap dengan:

- <h1>Judul panjang dan unik</h1>
- <p>Pembuka</p>
- 9-12 <h2> dan <p>
- Penutup yang kuat

Gaya penulisan harus variatif dan kredibel.
          `.trim(),
        },
        {
          role: "user",
          content: `Tulis artikel dengan topik: ${topic}`,
        },
      ],
    });

    const article = response.choices?.[0]?.message?.content || "Artikel gagal dibuat.";
    res.status(200).json({ result: article });
  } catch (error: any) {
    console.error("Error generating article:", error);
    res.status(500).json({ error: error.message || "Failed to generate article" });
  }
}