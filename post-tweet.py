#!/usr/bin/env python3
from playwright.sync_api import sync_playwright

tweet_text = """I just built PagePilot - an AI that generates landing pages from your product description.

Built in 24 hours. No design skills needed.

$0 to start. $49/mo for 5 pages.

https://graceful-caramel-f3216a.netlify.app"""

with sync_playwright() as p:
    browser = p.chromium.launch(
        headless=True,
        executable_path='/tmp/pw-browsers/chromium-1217/chrome-linux64/chrome'
    )
    page = browser.new_page()
    
    try:
        # Go to home first
        page.goto('https://twitter.com/home', timeout=30000)
        page.wait_for_timeout(2000)
        
        # Click the "Post" button in the sidebar (floating compose)
        post_btn = page.locator('a[href="/compose/post"]')
        if post_btn.is_visible():
            print('Found Post button, clicking...')
            post_btn.click()
            page.wait_for_timeout(2000)
        
        print('Title after navigation:', page.title())
        
        # Now try to find and fill the tweet box
        textbox = page.locator('[data-testid="tweetTextarea_0"]')
        if textbox.is_visible(timeout=5000):
            print('Found tweet box!')
            textbox.click()
            textbox.fill(tweet_text)
            page.wait_for_timeout(1000)
            
            # Find tweet button
            tweet_btn = page.locator('[data-testid="tweetButton"]')
            tweet_btn.wait_for(timeout=5000)
            if tweet_btn.is_enabled():
                print('Clicking Tweet button...')
                tweet_btn.click()
                print('TWEET POSTED SUCCESSFULLY!')
            else:
                print('Tweet button not enabled')
        else:
            print('Could not find tweet box')
            
    except Exception as e:
        print(f'Error: {e}')
    
    browser.close()
