const { withAuth } = require("../../lib/auth");
const supabase = require("../../lib/supabase");

module.exports = withAuth(async (req, res) => {
  if (req.method === "GET") {
    try {
      const { data, error } = await supabase
        .from("settings")
        .select("*")
        .eq("key", "site_settings")
        .single();

      if (error || !data) {
        return res.json({ siteName: "Adway", contactEmail: "hello@adway.com" });
      }
      res.json(data.value);
    } catch (err) {
      res.json({ siteName: "Adway", contactEmail: "hello@adway.com" });
    }
  } else if (req.method === "PATCH") {
    try {
      await supabase
        .from("settings")
        .upsert({
          key: "site_settings",
          value: req.body,
          updated_at: new Date().toISOString(),
        });
      res.json(req.body);
    } catch (err) {
      res.status(500).json({ error: "Failed to save settings", details: err.message });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
});
