require("dotenv").config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for port 465, false for other ports
  /* 👇 THIS IS THE CRITICAL FIX */
  connectionTimeout: 10000, // 10 seconds timeout
  greetingTimeout: 10000,
  dnsTimeout: 10000,
  // Force IPv4 resolution by overriding the family connection choice
  family: 4, 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

module.exports = transporter;
