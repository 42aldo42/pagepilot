#!/usr/bin/env python3
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(
        headless=False,
        executable_path='/tmp/pw-browsers/chromium-1217/chrome-linux64/chrome',
        user_data_dir='/home/ubuntu/.config/abacus-google-chrome'
    )
    page = browser.new_page()
    
    print('Using user Chrome profile...')
    page.goto('https://twitter.com/home', timeout=30000, wait_until='domcontentloaded')
    page.wait_for_timeout(5000)
    
    print('Title:', page.title())
    
    content = page.content()
    if 'Log in' in page.title() or 'Sign in' in content:
        print('NOT LOGGED IN')
    else:
        print('LOGGED IN!')
        # Try to post a tweet
        page.goto('https://twitter.com/compose/tweet', timeout=30000)
        page.wait_for_timeout(3000)
        
        tweet_text = """I just built PagePilot - an AI landing page builder.

Describe your product, get a converting landing page in minutes.

$0 to start. $49/mo for 5 pages.

https://graceful-caramel-f3216a.netlify.app"""
        
        # Find and fill tweet box
        tweet_box = page.locator('[data-testid="tweetTextarea_0"]')
        if tweet_box.is_visible():
            print('Found tweet box, posting...')
            tweet_box.fill(tweet_text)
            page.wait_for_timeout(1000)
            
            tweet_btn = page.locator('[data-testid="tweetButton"]')
            if tweet_btn.is_enabled():
                tweet_btn.click()
                print('TWEET POSTED!')
            else:
                print('Tweet button not enabled')
        else:
            print('Tweet box not visible')
    
    browser.close()
