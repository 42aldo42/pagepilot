const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ 
    headless: true,
    executablePath: '/tmp/pw-browsers/chromium_headless_shell-1217/chrome-linux/headless_shell'
  });
  const page = await browser.newPage();
  
  try {
    await page.goto('https://twitter.com', { timeout: 30000 });
    console.log('Loaded Twitter');
    
    // Get page content
    const title = await page.title();
    console.log('Title:', title);
    
    // Check if logged in
    const content = await page.content();
    if (content.includes('Sign in') && content.includes('phone, email, or username')) {
      console.log('NOT LOGGED IN - Need auth');
    } else {
      console.log('May be logged in or on login page');
    }
    
  } catch (e) {
    console.error('Error:', e.message);
  }
  
  await browser.close();
})();
