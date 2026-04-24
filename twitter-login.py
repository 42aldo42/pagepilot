#!/usr/bin/env python3
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(
        headless=False,
        executable_path='/tmp/pw-browsers/chromium-1217/chrome-linux64/chrome'
    )
    page = browser.new_page()
    
    print('Going to Twitter login...')
    page.goto('https://twitter.com/login', timeout=60000, wait_until='domcontentloaded')
    page.wait_for_timeout(10000)
    
    print('Title:', page.title())
    
    # Save screenshot
    page.screenshot(path='/home/ubuntu/pagepilot/twitter-login.png')
    print('Screenshot saved to twitter-login.png')
    
    # Find inputs
    inputs = page.locator('input').all()
    print(f'Found {len(inputs)} inputs:')
    for i, inp in enumerate(inputs):
        try:
            print(f'  {i}: placeholder="{inp.get_attribute("placeholder")}" type="{inp.get_attribute("type")}"')
        except:
            pass
    
    # Keep browser open for manual interaction
    print('\nBrowser will stay open. Complete login manually.')
    print('Press Enter in terminal to close browser...')
    
    import sys
    sys.stdin.readline()
    
    browser.close()
