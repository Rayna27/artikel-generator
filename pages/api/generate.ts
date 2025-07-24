import type { NextApiRequest, NextApiResponse } from "next";
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { topic } = req.body;
  const timestamp = new Date().toISOString();

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
      temperature: 1.2,
      top_p: 0.95,
      presence_penalty: 0.5,
      frequency_penalty: 0.2,
      messages: [
        {
          role: "system",
          content: `
Kamu adalah penulis artikel profesional dan kreatif. Tulis artikel panjang berbentuk HTML dengan struktur lengkap sebagai berikut:

<h1>Judul artikel panjang, unik, dan menarik</h1>
<p>Pembuka 1 paragraf yang langsung mengajak pembaca untuk menyimak lebih lanjut</p>

<h2>Subjudul 1</h2>
<p>Paragraf isi yang padat dan relevan</p>

(Sertakan 9–12 subjudul <h2>, masing-masing diikuti 1 <p> yang berisi penjelasan solid dan tidak generik)

Ketentuan:
- Gaya penulisan harus: informatif, kredibel, persuasif, dan menggugah semangat
- Gunakan kosakata yang sedang trending di Google Trends Indonesia jika cocok
- Setiap paragraf harus membawa insight atau sudut pandang baru
- Jangan mengulang struktur, gaya, atau isi dari artikel sebelumnya
- Variasikan gaya, ritme, dan diksi agar tidak membosankan
- Penutup tidak boleh klise — harus diakhiri dengan kalimat yang kuat dan mendorong aksi

Terapkan gaya penulisan: ${randomStyle}

Output hanya dalam format HTML — tanpa komentar, penjelasan, atau tag lainnya. Harus siap tampil langsung di halaman web.
        `.trim(),
        },
        {
          role: "user",
          content: `Tulis artikel dengan topik: ${topic} — ${timestamp}`,
        },
      ],
    });

    const article = response.choices[0]?.message?.content || "Artikel gagal dibuat.";
    res.status(200).json({ result: article }); // ← INI YANG PALING PENTING
  } catch (error: any) {
    console.error("Error generating article:", error);
    res.status(500).json({ error: error.message || "Failed to generate article" });
  }
}