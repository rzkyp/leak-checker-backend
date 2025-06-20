// leak-checker-backend/api/check-leak.js
import fetch from 'node-fetch'; // Menggunakan import ES Module
import dotenv from 'dotenv'; // Menggunakan import ES Module

dotenv.config(); // Memuat variabel dari .env

export default async (req, res) => {
  // Pastikan metode adalah GET
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { type, value } = req.query; // Ambil parameter dari query string

  // Validasi input
  if (!type || !value) {
    return res.status(400).json({ error: 'Missing type or value parameter' });
  }

  const apiKey = process.env.LEAKCHECK_API_KEY; // Ambil API Key dari variabel lingkungan

  if (!apiKey) {
    console.error("LEAKCHECK_API_KEY not configured.");
    return res.status(500).json({ error: 'Server configuration error: API Key missing' });
  }

  const apiURL = `https://leakcheck.io/api?key=<span class="math-inline">\{apiKey\}&type\=</span>{type}&check=${encodeURIComponent(value)}`;

  try {
    const response = await fetch(apiURL);
    const json = await response.json();

    // Mengembalikan respons dari LeakCheck.io langsung ke frontend
    res.status(response.status).json(json);

  } catch (error) {
    console.error("Error calling LeakCheck.io API:", error);
    res.status(500).json({ error: 'Internal Server Error when contacting external API' });
  }
};
