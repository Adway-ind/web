const { withAuth } = require("../../lib/auth");
const transporter = require("../../lib/mail");

module.exports = withAuth(async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { to, subject, message } = req.body;
    if (!to || !subject || !message) {
      return res.status(400).json({ error: "To, subject, and message are required." });
    }

    await transporter.sendMail({
      from: `"Adway Admin" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: `
        <div style="padding:30px;text-align:center;border-bottom:1px solid #e5e7eb;">
          <img src="${process.env.CLIENT_URL}/logo.png" alt="Adway Creations" style="height:40px;" />
        </div>
        <div style="padding:40px 32px;">
          <div style="font-size:15px;line-height:1.8;color:#374151;">
            ${message.replace(/\n/g, "<br/>")}
          </div>
        </div>
        <div style="padding:24px 32px;background:#fafafa;border-top:1px solid #e5e7eb;">
          <p style="margin:0;font-size:14px;color:#4b5563;">
            Regards,<br /><strong>Adway Creations Team</strong>
          </p>
          <p style="margin:16px 0 0;font-size:12px;color:#9ca3af;">
            &copy; ${new Date().getFullYear()} Adway Creations. All rights reserved.
          </p>
        </div>
      `,
    });

    res.json({ success: true });
  } catch (err) {
    console.error("Send email error:", err);
    res.status(500).json({ error: err.message });
  }
});
