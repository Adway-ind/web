const crypto = require("crypto");
const supabase = require("../lib/supabase");

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { name, email, subject, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: "Name, email, and message are required" });
  }

  try {
    const id = crypto.randomUUID();
    const { data, error } = await supabase
      .from("messages")
      .insert({
        id,
        name,
        email,
        subject: subject || "",
        message,
        read: false,
      })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json({ success: true, id: data.id });
  } catch (err) {
    res.status(500).json({ error: "Failed to save message", details: err.message });
  }
};
