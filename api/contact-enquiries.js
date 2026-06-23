const supabase = require("../lib/supabase");

module.exports = async (req, res) => {
  if (req.method === "POST") {
    try {
      const { name, email, company, service, budget, message } = req.body;
      if (!name || !email || !message) {
        return res.status(400).json({ success: false, message: "Name, email and message are required" });
      }
      const { error } = await supabase.from("contact_enquiries").insert({
        name,
        email,
        company: company || null,
        service: service || null,
        budget: budget || null,
        message,
      });
      if (error) throw error;
      res.status(201).json({ success: true, message: "Contact enquiry submitted successfully" });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  } else if (req.method === "GET") {
    try {
      const { data, error } = await supabase
        .from("contact_enquiries")
        .select("*")
        .order("createdAt", { ascending: false });
      if (error) throw error;
      res.json(data || []);
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
};
