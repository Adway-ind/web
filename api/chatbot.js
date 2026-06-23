const { getChatbotReply } = require("../lib/chatbot");

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { message, history } = req.body || {};
  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "Message text is required." });
  }

  try {
    const reply = await getChatbotReply(message, Array.isArray(history) ? history : []);
    res.json({ reply });
  } catch (err) {
    console.error("Chatbot request failed:", err);
    res.status(500).json({ error: "Failed to generate chatbot reply.", details: err.message });
  }
};
