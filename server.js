const express = require("express");
const puppeteer = require('puppeteer');
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.post("/screenshot", async (req, res) => {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: "new",
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--disable-web-security",
        "--disable-features=VizDisplayCompositor"
      ]
    });
    
    const page = await browser.newPage();
    await page.goto("https://web-frontend-rosy-mu.vercel.app", { 
      waitUntil: "networkidle0",
      timeout: 30000
    });
    
    // Wait for content to load
    await page.waitForTimeout(2000);
    
    const screenshot = await page.screenshot({ 
      fullPage: true,

    });
    
    res.set({
      "Content-Type": "image/png",
      "Content-Disposition": "attachment; filename=infographic_screenshot.png",
    });
    res.send(screenshot);
    
  } catch (error) {
    console.error('Screenshot error:', error);
    res.status(500).json({ error: 'Failed to take screenshot' });
  } finally {
    if (browser) {
      await browser.close();
    }
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});