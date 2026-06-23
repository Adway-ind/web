const { withAuth } = require("../../../lib/auth");
const supabase = require("../../../lib/supabase");

module.exports = withAuth(async (req, res) => {
  const { id } = req.query;

  if (req.method === "PATCH") {
    try {
      const { data: client } = await supabase.from("clients").select("*").eq("id", id).single();
      if (!client) return res.status(404).json({ error: "Client not found" });

      const { name, position, logoUrl } = req.body;
      const finalName = name !== undefined ? name : client.name;
      const finalPosition = position !== undefined && position !== "" ? Number(position) : client.position;

      const { data, error } = await supabase
        .from("clients")
        .update({
          name: finalName,
          logo: logoUrl || client.logo,
          position: finalPosition,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: "Failed to update client", details: err.message });
    }
  } else if (req.method === "DELETE") {
    try {
      const { error } = await supabase.from("clients").delete().eq("id", id);
      if (error) throw error;
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: "Failed to delete client", details: err.message });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
});
