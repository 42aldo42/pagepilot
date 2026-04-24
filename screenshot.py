#!/usr/bin/env python3
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(
        headless=True,
        executable_path='/tmp/pw-browsers/chromium-1217/chrome-linux64/chrome'
    )
    page = browser.new_page()
    
    try:
        page.goto('https://twitter.com/home', timeout=30000)
        page.wait_for_timeout(3000)
        
        # Save screenshot
        page.screenshot(path='/home/ubuntu/pagepilot/twitter-screenshot.png', full_page=True)
        print('Screenshot saved to /home/ubuntu/pagepilot/twitter-screenshot.png')
        
        # Get all buttons and textboxes
        print('\nButtons found:')
        for btn in page.locator('button').all():
            try:
                txt = btn.inner_text()[:50] if btn.inner_text() else ''
                if txt.strip():
                    print(f'  - {txt.strip()[:30]}')
            except:
                pass
        
        print('\nTextboxes found:')
        for tb in page.locator('textbox').all():
            try:
                print(f'  - {tb.get_attribute("placeholder")}')
            except:
                pass
                
    except Exception as e:
        print(f'Error: {e}')
    
    browser.close()
