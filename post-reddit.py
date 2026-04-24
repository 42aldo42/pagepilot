#!/usr/bin/env python3
from playwright.sync_api import sync_playwright

title = "I built an AI landing page builder in 1 day - no design skills needed"
text = """Built this during a hackathon. Describe your product, get a converting landing page in minutes.

Features:
- AI-generated copy & layout
- 1-click publish
- $0 to start, $49/mo for 5 pages

Would love feedback from fellow founders."""

with sync_playwright() as p:
    context = p.chromium.launch_persistent_context(
        user_data_dir='/tmp/chrome-profile-copy',
        headless=False,
        executable_path='/tmp/pw-browsers/chromium-1217/chrome-linux64/chrome'
    )
    page = context.new_page()
    
    print('Going to Reddit submit')
    page.goto('https://www.reddit.com/r/entrepreneur/submit', timeout=30000, wait_until='domcontentloaded')
    page.wait_for_timeout(5000)
    
    page.screenshot(path='/home/ubuntu/pagepilot/reddit-submit.png')
    print('Submit page screenshot saved')
    
    # Check for title input
    title_input = page.locator('input[name="title"]')
    if title_input.is_visible():
        print('Found title input')
        title_input.fill(title)
        
        # Check for text area
        text_area = page.locator('div[contenteditable="true"]')
        if text_area.is_visible():
            print('Found text area')
            text_area.fill(text)
        
        # Look for submit button
        submit_btn = page.locator('button:has-text("Post")')
        if submit_btn.is_visible():
            print('Found Post button')
            submit_btn.click()
            page.wait_for_timeout(3000)
            print('POST SUBMITTED!')
        else:
            print('No Post button found')
    else:
        print('Title input not visible')
        # Check what's on the page
        body_text = page.locator('body').inner_text()
        if 'Log In' in body_text:
            print('Need to log in')
    
    context.close()
