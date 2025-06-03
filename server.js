const express = require("express");
const puppeteer = require("puppeteer");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static(path.join(__dirname, "../frontend")));

app.post("/screenshot", async (req, res) => {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });
  const page = await browser.newPage();

  await page.goto("https://web-frontend-rosy-mu.vercel.app", { waitUntil: "networkidle0" });
   // ✅ Wait extra time to ensure all fonts, styles, images are rendered
//   await page.waitForTimeout(2000); // 2 seconds – adjust as needed
  const screenshot = await page.screenshot({ fullPage: true });

  await browser.close();

  res.set({
    "Content-Type": "image/png",
    "Content-Disposition": "attachment; filename=infographic_screenshot.png",
  });
  res.send(screenshot);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
