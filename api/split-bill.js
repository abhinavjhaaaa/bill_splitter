export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { imageBase64 } = req.body;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "Extract items, prices, total, and restaurant name from this bill image. Return JSON format."
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Analyze this receipt"
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${imageBase64}`
                }
              }
            ]
          }
        ]
      }),
    });

    const data = await response.json();

    return res.status(200).json({
      success: true,
      ai: data
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
}