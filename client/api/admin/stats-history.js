const { withAuth } = require("../../lib/auth");
const supabase = require("../../lib/supabase");

module.exports = withAuth(async (req, res) => {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  try {
    const days = 7;
    const labels = [];
    const applications = [];
    const messages = [];
    const chat = [];
    const contact = [];

    for (let i = days - 1; i >= 0; i--) {
      const from = new Date();
      from.setDate(from.getDate() - i);
      from.setHours(0, 0, 0, 0);
      const to = new Date(from);
      to.setHours(23, 59, 59, 999);

      labels.push(from.toLocaleDateString("en-US", { weekday: "short" }));

      const { count: appCount } = await supabase
        .from("applications").select("*", { count: "exact", head: true })
        .gte("created_at", from.toISOString()).lte("created_at", to.toISOString());
      applications.push(appCount || 0);

      const { count: chatCount } = await supabase
        .from("chat_enquiries").select("*", { count: "exact", head: true })
        .gte("created_at", from.toISOString()).lte("created_at", to.toISOString());
      chat.push(chatCount || 0);

      const { count: msgCount } = await supabase
        .from("messages").select("*", { count: "exact", head: true })
        .gte("createdAt", from.toISOString()).lte("createdAt", to.toISOString());
      messages.push(msgCount || 0);

      const { count: contactCount } = await supabase
        .from("contact_enquiries").select("*", { count: "exact", head: true })
        .gte("createdAt", from.toISOString()).lte("createdAt", to.toISOString());
      contact.push(contactCount || 0);
    }

    res.json({ labels, applications, messages, chat, contact });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch history", details: err.message });
  }
});
