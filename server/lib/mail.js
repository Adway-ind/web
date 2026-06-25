require("dotenv").config();
const nodemailer = require("nodemailer");

// 👇 Force the Node runtime to resolve IPv4 addresses first
const dns = require("dns");
dns.setDefaultResultOrder("ipv4first");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,               // 🔄 Changed from 587 to 465
  secure: true,            // 🔄 Changed from false to true for port 465
  connectionTimeout: 15000, 
  greetingTimeout: 15000,
  dnsTimeout: 15000,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

module.exports = transporter;