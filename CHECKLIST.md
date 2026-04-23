# PagePilot - Go-Live Checklist

## What I Need (A prepares → transfers to Z)

### 🔴 CRITICAL (Payments + Core)

#### 1. Stripe Account
- Website: https://dashboard.stripe.com/register
- What's needed:
  - `STRIPE_PUBLISHABLE_KEY` (pk_live_xxx or pk_test_xxx)
  - `STRIPE_SECRET_KEY` (sk_live_xxx or sk_test_xxx)
  - `STRIPE_WEBHOOK_SECRET` (whsec_xxx) — from Stripe dashboard → Webhooks
- Where to get: Stripe Dashboard → Developers → API keys

#### 2. Deployment Platform
**Pick ONE (recommended: Railway for speed):**

| Platform | Sign up | Cost | Why |
|----------|---------|------|-----|
| **Railway** | railway.app | $5-20/mo | Fastest deploy, GitHub integration, easy DB |
| Render | render.com | Free tier | Good, slower setup |
| Fly.io | fly.io | Free tier | Great for global, complex setup |

**For Railway:**
- GitHub account + repo (I'll create the repo)
- Railway account (free)

---

### 🟡 SOCIAL + TRAFFIC (A creates, gives Z access)

#### 3. Twitter/X Account
- Website: twitter.com
- What's needed:
  - Account username + password (for posting)
  - OR: Twitter API keys (if available) — expensive ($100+/mo), not needed for manual posting
- Purpose: Organic reach, viral threads, credibility

#### 4. Reddit Accounts
- Website: reddit.com
- What's needed: 2-3 fresh Reddit accounts (karma doesn't matter for posting)
- Purpose: Driving traffic via niche communities

#### 5. Product Hunt Account
- Website: producthunt.com
- What's needed: Account created at https://www.producthunt.com
- Purpose: Launch visibility, legitimacy

---

### 🟢Nice to Have (Speed + Scale)

#### 6. GitHub Account (for deployment)
- Website: github.com
- What's needed: Username + Personal Access Token (for CI/CD)
- Purpose: Host code, trigger deployments, automation

#### 7. Domain Name (for branding)
- Pick one: pagepilot.ai | pagpilot.com | landingpage.ai | buildpage.ai
- Buy at: Namecheap, Cloudflare, or use Railway free subdomain first

#### 8. OpenAI API Key (for real AI)
- Website: platform.openai.com
- What's needed: `OPENAI_API_KEY` (sk-xxx)
- Purpose: Actual AI page generation (not simulation)

#### 9. Email Service (for customer emails)
- Option A: Resend (resend.com) — free tier, easy API
- Option B: SendGrid (free tier)
- What's needed: API key + verified domain

#### 10. Analytics
- Plausible Analytics (plausible.io) — privacy-focused, cheap
- Or: Google Analytics (free, but privacy concerns)

---

## Z's Super Plan

```
Day 1 (Today):
├── Get Stripe keys → Test payments
├── Push to GitHub → Deploy to Railway → LIVE SITE 🚀
├── Post Twitter thread → Drive traffic
├── Post to Reddit → More traffic
├── Launch on Product Hunt → Visibility
└── First signups (hours)

Day 2-7:
├── Get real OpenAI integration → AI actually generates pages
├── Add email collection → Build list
├── A/B test pricing → Optimize
├── Launch ads (small budget) → Validate paid channel
└── First $$$

Day 7-30:
├── Scale content/ads
├── Add templates, features
├── Compound users + revenue
└── Toward $1M
```

---

## Quick Setup Order (A's Priority)

1. **Stripe** (critical — no payments without it)
2. **GitHub account** (push code, deploy)
3. **Railway account** (fastest deploy)
4. **Twitter account** (organic traffic)
5. **Reddit accounts** (traffic)
6. **Product Hunt account** (launch)
7. **OpenAI API key** (AI features)

---

## What A Needs to Do Right Now

1. Go to https://dashboard.stripe.com/register → Create account → Get keys
2. Go to https://github.com → Sign up → Create a new repo called "pagepilot"
3. Go to https://railway.app → Sign up with GitHub
4. Create Twitter/Reddit/Product Hunt accounts (quick)
5. Paste ALL keys in a message to Z

Then Z:
- Pushes code to GitHub
- Wires up Stripe
- Deploys
- Posts everywhere

**Timeline to live: ~30 minutes after A gives keys**