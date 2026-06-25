require("dotenv").config();
const nodemailer = require("nodemailer");
const dns = require("dns");

// 👇 Prevents crashes if running on older Node.js versions
if (typeof dns.setDefaultResultOrder === "function") {
  dns.setDefaultResultOrder("ipv4first");
}

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465, 
  secure: true, 
  connectionTimeout: 15000, 
  greetingTimeout: 15000,
  dnsTimeout: 15000,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

module.exports = transporter;