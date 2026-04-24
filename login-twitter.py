from playwright.sync_api import sync_playwright

password = "mektiv-femXyd-vaswu8"

with sync_playwright() as p:
    ctx = p.chromium.launch_persistent_context(
        user_data_dir='/tmp/cp-final',
        headless=False,
        executable_path='/tmp/pw-browsers/chromium-1217/chrome-linux64/chrome'
    )
    page = ctx.new_page()
    
    print("Loading Twitter login...")
    page.goto('https://twitter.com/login', timeout=60000)
    page.wait_for_load_state('domcontentloaded')
    page.wait_for_timeout(10000)
    
    print("Filling username...")
    page.locator('input[autocomplete="username"]').fill('42aldo42aldo@gmail.com')
    
    print("Clicking Next...")
    page.locator('button:has-text("Next")').click()
    page.wait_for_timeout(10000)
    
    print(f"URL: {page.url()}")
    print(f"Title: {page.title()}")
    
    pwd = page.locator('input[type="password"]')
    if pwd.is_visible():
        print("Password field visible!")
        pwd.fill(password)
        page.locator('button:has-text("Sign in")').click()
        page.wait_for_timeout(5000)
        
        print("Going to compose tweet...")
        page.goto('https://twitter.com/compose/tweet')
        page.wait_for_timeout(5000)
        
        tweet_area = page.locator('[data-testid="tweetTextarea_0"]')
        if tweet_area.is_visible():
            print("Posting tweet...")
            tweet_area.fill('I just built PagePilot - an AI landing page builder. Describe your product, get a converting landing page in minutes. $0 to start. $49/mo for 5 pages. https://graceful-caramel-f3216a.netlify.app')
            page.locator('[data-testid="tweetButton"]').click()
            print("TWEET POSTED!")
    else:
        print("No password field visible")
        page.screenshot(path='/home/ubuntu/pagepilot/no-password.png')
        
        # Debug: get page content
        body = page.inner_text('body')
        print("Body text:", body[:300])
    
    ctx.close()
