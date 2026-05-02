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
        model: "gpt-5.4-mini",
        messages: [
          {
            role: "system",
            content:
              "You are a strict JSON generator. Extract restaurant name, items (name and price), and total from receipt image. Return ONLY valid JSON like: {\"restaurant\":\"\",\"items\":[{\"name\":\"\",\"price\":0}],\"total\":0}"
          },
          {
            role: "user",
            content: [
              { type: "text", text: "Analyze this receipt" },
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

    // Extract AI response text
    const content = data.choices?.[0]?.message?.content || "{}";

    // Convert string → JSON safely
    let parsed = {};
    try {
      parsed = JSON.parse(content);
    } catch (e) {
      console.log("Parsing failed:", content);
    }

    return res.status(200).json({
      success: true,
      ...parsed
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
}