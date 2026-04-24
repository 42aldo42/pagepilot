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
    page.wait_for_timeout(5000)
    
    # Check if we're actually logged in via cookies
    cookies = context.cookies()
    print(f'Cookies: {len(cookies)}')
    for c in cookies:
        if 'twitter' in c['domain'] or 'x.com' in c['domain']:
            print(f'  {c["name"]}: {c["value"][:20]}...')
    
    # Check localStorage for auth
    auth_token = page.evaluate("() => localStorage.getItem('auth_token')")
    print(f'Auth token: {auth_token[:30] if auth_token else "None"}...')
    
    context.close()
