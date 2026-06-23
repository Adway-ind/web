const crypto = require("crypto");
const supabase = require("../lib/supabase");

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { service, projectType, budget, timeline, contact } = req.body || {};

  if (!service || !projectType || !budget || !timeline || !contact || !contact.name || !contact.email || !contact.phone) {
    return res.status(400).json({ error: "Required inquiry fields are missing." });
  }

  try {
    const id = crypto.randomUUID();
    const { data, error } = await supabase
      .from("chat_enquiries")
      .insert({
        id,
        service,
        project_type: projectType,
        budget,
        timeline,
        contact_name: contact.name,
        contact_business: contact.business || "",
        contact_email: contact.email,
        contact_phone: contact.phone,
        contact_requirements: contact.requirements || "",
        read: false,
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      enquiry: {
        id,
        service,
        projectType,
        budget,
        timeline,
        contact: {
          name: contact.name,
          business: contact.business || "",
          email: contact.email,
          phone: contact.phone,
          requirements: contact.requirements || "",
        },
        read: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    });
  } catch (err) {
    console.error("Chat enquiry save failed:", err);
    res.status(500).json({ error: "Failed to save inquiry.", details: err.message });
  }
};
