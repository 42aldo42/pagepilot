#!/usr/bin/env python3
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(
        headless=True,
        executable_path='/tmp/pw-browsers/chromium-1217/chrome-linux64/chrome'
    )
    page = browser.new_page()
    
    try:
        page.goto('https://twitter.com', timeout=30000)
        page.wait_for_timeout(2000)
        
        print('Title:', page.title())
        
        # Check for login form
        content = page.content()
        if 'Sign in to X' in content or 'phone, email, or username' in content:
            print('NOT LOGGED IN - Need credentials')
        elif 'Home' in content or 'Latest' in content:
            print('LOGGED IN - Can post')
        else:
            print('Unknown state')
            
    except Exception as e:
        print(f'Error: {e}')
    
    browser.close()
