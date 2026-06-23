const { withAuth } = require("../../lib/auth");
const supabase = require("../../lib/supabase");

module.exports = withAuth(async (req, res) => {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { count: appCount } = await supabase.from("applications").select("*", { count: "exact", head: true });
    const { count: msgCount } = await supabase.from("messages").select("*", { count: "exact", head: true });
    const { count: chatCount } = await supabase.from("chat_enquiries").select("*", { count: "exact", head: true });
    const { count: contactCount } = await supabase.from("contact_enquiries").select("*", { count: "exact", head: true });
    const { count: projectCount } = await supabase.from("projects").select("*", { count: "exact", head: true });
    const { count: blogCount } = await supabase.from("blogs").select("*", { count: "exact", head: true });
    const { count: clientCount } = await supabase.from("clients").select("*", { count: "exact", head: true });

    const { count: newApps } = await supabase.from("applications").select("*", { count: "exact", head: true }).eq("status", "new");
    const { count: unreadMsgs } = await supabase.from("messages").select("*", { count: "exact", head: true }).eq("read", false);
    const { count: unreadChat } = await supabase.from("chat_enquiries").select("*", { count: "exact", head: true }).eq("read", false);

    res.json({
      applications: appCount || 0,
      messages: msgCount || 0,
      chatEnquiries: chatCount || 0,
      contactEnquiries: contactCount || 0,
      projects: projectCount || 0,
      blogs: blogCount || 0,
      clients: clientCount || 0,
      newApplications: newApps || 0,
      unreadMessages: unreadMsgs || 0,
      unreadChatEnquiries: unreadChat || 0,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch stats", details: err.message });
  }
});
