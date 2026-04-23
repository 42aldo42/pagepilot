# PagePilot 🚀

**AI-powered landing page builder. Describe your product → get a converting page in minutes.**

## Quick Start

```bash
git clone https://github.com/YOUR_USERNAME/pagepilot.git
cd pagepilot
npm install
cd client && npm install && npm run build && cd ..
node server.js
```

## Tech Stack

- **Frontend:** React (CRA)
- **Backend:** Express.js
- **Payments:** Stripe
- **AI:** OpenAI (optional)

## Environment Variables

Create `.env` in root:

```env
STRIPE_PUBLISHABLE_KEY=pk_live_xxx
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
OPENAI_API_KEY=sk-xxx
PORT=3000
```

## Deploy

**Railway:**
1. Connect GitHub repo
2. Set environment variables
3. Railway auto-detects Node.js and deploys

**Render:**
1. Connect GitHub repo
2. Build command: `npm install && cd client && npm install && npm run build && cd ..`
3. Start command: `node server.js`

## Features

- [x] Landing page with pricing
- [x] AI onboarding wizard
- [x] Stripe checkout integration
- [x] Subscription management
- [x] Webhook handlers
- [x] Mobile responsive

## Roadmap

- [ ] Real AI page generation (OpenAI)
- [ ] Email collection
- [ ] Custom domain support
- [ ] A/B testing
- [ ] Analytics dashboard
- [ ] Template library

## License

MIT