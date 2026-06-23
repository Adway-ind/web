const { withAuth } = require("../../lib/auth");
const supabase = require("../../lib/supabase");

module.exports = withAuth(async (req, res) => {
  if (req.method === "GET") {
    try {
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .order("position", { ascending: true })
        .order("created_at", { ascending: true });

      if (error) throw error;
      res.json(data || []);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch clients", details: err.message });
    }
  } else if (req.method === "POST") {
    try {
      const { name, position, logoUrl } = req.body;
      if (!name) return res.status(400).json({ error: "Client name is required" });

      const { data: maxRow } = await supabase
        .from("clients")
        .select("position")
        .order("position", { ascending: false })
        .limit(1)
        .single();

      const finalPosition = position !== undefined && position !== ""
        ? Number(position)
        : (maxRow?.position || 0) + 1;

      const { data, error } = await supabase
        .from("clients")
        .insert({
          name,
          logo: logoUrl || "",
          position: finalPosition,
        })
        .select()
        .single();

      if (error) throw error;
      res.status(201).json(data);
    } catch (err) {
      res.status(500).json({ error: "Failed to create client", details: err.message });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
});
