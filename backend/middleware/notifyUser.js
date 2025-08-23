const geoip = require("geoip-lite");
const useragent = require("express-useragent");
const moment = require("moment-timezone");
const sendEmail = require("../utils/sendEmail");

exports.notifyUser = async (req, res, next) => {
  const start = Date.now();

  const rawIp =
    req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress;
  let ip = rawIp;
  if (ip === "::1") ip = "127.0.0.1";
  if (ip.startsWith("::ffff:")) ip = ip.split(":").pop();
  const geo = geoip.lookup(ip) || {};

  const nowUtc = new Date().toISOString();
  // Get formatted UTC
  const utcMoment = moment.utc(nowUtc);
  const utcFormatted = utcMoment.format("Do MMMM YYYY [at] hh:mm A");

  // Get formatted IST
  const istMoment = utcMoment.clone().tz("Asia/Kolkata");
  const istFormatted = istMoment.format("Do MMMM YYYY [at] hh:mm A");

  const email = req.body.email || req.user?.email || "unknown";
  const url = `${req.method} ${req.originalUrl}`;

  return res.on("finish", async () => {
    const duration = Date.now() - start;
    const success = res.statusCode < 400;

    const html = `
        <h2>${url}</h2>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>IP:</strong> ${ip} (${geo.city || "Unknown"}, ${
      geo.country || "Unknown"
    })</p>
        <p><strong>Browser / OS:</strong> ${req.useragent.browser} / ${
      req.useragent.os
    }</p>
        <p><strong>Request Time (UTC / IST):</strong> ${utcFormatted} / ${istFormatted}</p>
        <p><strong>Status:</strong> ${res.statusCode} ${
      success ? "✅" : "❌"
    }</p>
        <p><strong>Duration:</strong> ${duration} ms</p>
      `;

    // console.log(html);
    try {
      await sendEmail({
        email: email,
        subject: `${success ? "Success" : "Failed"} – ${url}`,
        html,
      });
    } catch (error) {
      console.log(error);
    }
  });
};
