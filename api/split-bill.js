export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false });
  }

  try {
    const { imageBase64, mimeType } = req.body;

    return res.status(200).json({
      success: true,
      restaurant: "Demo Restaurant",
      items: [
        { name: "Burger", price: 120 },
        { name: "Pizza", price: 250 }
      ],
      subtotal: 370,
      tax: 30,
      total: 400
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Server error"
    });
  }
}