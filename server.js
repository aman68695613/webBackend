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
      executablePath: '/usr/bin/google-chrome',
      headless: "new",
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
        '--disable-gpu',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding'
      ]
    });
    
    const page = await browser.newPage();
    
    // Set viewport for consistent screenshots
    await page.setViewport({ width: 1200, height: 800 });
    
    await page.goto("https://web-frontend-rosy-mu.vercel.app", { 
      waitUntil: "networkidle0",
      timeout: 30000
    });
    
    // Wait for content to fully load
    await page.waitForTimeout(3000);
    
    const screenshot = await page.screenshot({ 
      fullPage: true,
      type: 'png'
    });
    
    res.set({
      "Content-Type": "image/png",
      "Content-Disposition": "attachment; filename=infographic_screenshot.png",
    });
    res.send(screenshot);
    
  } catch (error) {
    console.error('Screenshot error:', error);
    res.status(500).json({ 
      error: 'Failed to take screenshot',
      details: error.message 
    });
  } finally {
    if (browser) {
      await browser.close();
    }
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});