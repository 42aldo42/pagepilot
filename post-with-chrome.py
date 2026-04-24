#!/usr/bin/env python3
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    context = p.chromium.launch_persistent_context(
        user_data_dir='/tmp/chrome-profile-copy',
        headless=False,
        executable_path='/tmp/pw-browsers/chromium-1217/chrome-linux64/chrome'
    )
    page = context.new_page()
    
    print('Going to Twitter home')
    page.goto('https://twitter.com/home', timeout=30000, wait_until='domcontentloaded')
    page.wait_for_timeout(10000)
    
    # Print out all visible text on page to understand structure
    body = page.locator('body')
    text = body.inner_text()
    print('Page text preview:')
    print(text[:500])
    
    # Look for any element with "Tweet" text
    tweet_buttons = page.locator('button:has-text("Tweet")')
    print(f'Found {tweet_buttons.count()} buttons with Tweet text')
    
    # Look for any element with "Post" text  
    post_buttons = page.locator('button:has-text("Post")')
    print(f'Found {post_buttons.count()} buttons with Post text')
    
    context.close()
