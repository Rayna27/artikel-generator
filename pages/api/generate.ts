import type { NextApiRequest, NextApiResponse } from "next";
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { topic } = req.body;

  // Timestamp untuk variasi hasil
  const timestamp = new Date().toISOString();

  // Random gaya penulisan
  const styles = [
    "gaya naratif reflektif dengan sentuhan emosional",
    "gaya penjabaran tajam seperti kolumnis opini digital",
    "gaya informatif lugas seperti jurnalis tren teknologi",
    "gaya visual dan deskriptif seperti konten kreator profesional",
    "gaya storytelling ringan namun membangun semangat",
    "gaya eksplanatif dengan analogi unik dan ilustratif",
    "gaya observatif seolah pengamat sosial budaya",
  ];
  const randomStyle = styles[Math.floor(Math.random() * styles.length)];

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      temperature: 1.3,
      top_p: 0.95,
      presence_penalty: 0.7,
      frequency_penalty: 0.4,
      messages: [
        {
          role: "system",
          content: `
Kamu adalah penulis artikel profesional dan kreatif. Buat artikel HTML panjang dengan struktur berikut:

<h1>Judul artikel yang panjang, unik, menarik, dan tidak sama dengan topik input</h1>
<p>Paragraf pembuka yang langsung menggugah rasa penasaran pembaca</p>

<h2>Subjudul 1</h2>
<p>Isi paragraf padat, informatif, dan sesuai tema</p>

(Sertakan total 9–12 subjudul <h2>, masing-masing punya satu <p> isi yang unik dan relevan)

Aturan:
- Judul tidak boleh sama atau terlalu mirip dengan input topik — harus selalu di-*spin*
- Gaya bahasa: kredibel, persuasif, membangkitkan semangat, dan mudah dipahami
- Gunakan kata atau istilah trending di Google Trends Indonesia bila relevan
- Semua paragraf wajib membawa insight baru dan tidak boleh generik
- Hindari gaya monoton dan struktur berulang dari artikel sebelumnya
- Paragraf penutup harus kuat dan mendorong pembaca untuk refleksi atau bertindak
- Panjang total artikel minimal 1500 kata

Gunakan gaya penulisan: ${randomStyle}

Output hanya dalam format HTML — tanpa komentar atau penjelasan lain. Artikel harus siap ditampilkan langsung di halaman website.
          `.trim(),
        },
        {
          role: "user",
          content: `Tulis artikel dengan topik ini sebagai inspirasi: ${topic} — ${timestamp}`,
        },
      ],
    });

    const article = response.choices[0].message.content;
    res.status(200).json({ article });
  } catch (error) {
    console.error("Error generating article:", error);
    res.status(500).json({ error: "Failed to generate article" });
  }
}