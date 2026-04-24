#!/usr/bin/env python3
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(
        headless=True,
        executable_path='/tmp/pw-browsers/chromium-1217/chrome-linux64/chrome'
    )
    page = browser.new_page()
    
    try:
        print('Going to Reddit...')
        page.goto('https://www.reddit.com', timeout=30000)
        page.wait_for_timeout(3000)
        
        print('Title:', page.title())
        
        # Check if logged in
        content = page.content()
        if 'Log In' in content and 'Sign Up' in content:
            print('NOT LOGGED IN')
        else:
            print('LOGGED IN or unknown state')
            
        # Save screenshot
        page.screenshot(path='/home/ubuntu/pagepilot/reddit-screenshot.png')
        print('Screenshot saved')
        
    except Exception as e:
        print(f'Error: {e}')
    
    browser.close()
