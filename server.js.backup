const express = require('express');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'client', 'build')));

// Initialize Stripe only if we have keys
let stripe = null;
const stripeKey = process.env.STRIPE_SECRET_KEY;
if (stripeKey && stripeKey.startsWith('sk_')) {
  stripe = require('stripe')(stripeKey);
}

// Page generation simulation
const generatePage = (product, audience) => {
  const templates = {
    saas: { hero: 'Boost Your Workflow', cta: 'Start Free Trial', color: '#6366f1' },
    ecommerce: { hero: 'Shop Smart', cta: 'Shop Now', color: '#10b981' },
    portfolio: { hero: 'Showcase Your Work', cta: 'Get Started', color: '#f59e0b' }
  };
  return templates[product] || templates.saas;
};

// Create checkout session
app.post('/api/create-checkout', async (req, res) => {
  try {
    const { plan, email } = req.body;
    const prices = { starter: 0, growth: 4900, scale: 14900 };
    
    if (plan === 'starter') {
      return res.json({ url: '/?success=true&plan=starter' });
    }
    
    if (!stripe) {
      return res.status(500).json({ error: 'Stripe not configured' });
    }
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: { name: `PagePilot ${plan.charAt(0).toUpperCase() + plan.slice(1)} Plan` },
          unit_amount: prices[plan]
        },
        quantity: 1
      }],
      mode: 'subscription',
      customer_email: email,
      success_url: `/?success=true&plan=${plan}`,
      cancel_url: '/?canceled=true'
    });
    
    res.json({ url: session.url });
  } catch (err) {
    console.error('Stripe error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Webhook handler
app.post('/api/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  if (!stripe) {
    return res.status(500).json({ error: 'Stripe not configured' });
  }
  
  const sig = req.headers['stripe-signature'];
  let event;
  
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  
  switch (event.type) {
    case 'checkout.session.completed':
      console.log('💰 Payment succeeded:', event.data.object.id);
      break;
    case 'customer.subscription.deleted':
      console.log('📉 Subscription canceled');
      break;
  }
  
  res.json({ received: true });
});

// Get plan status
app.get('/api/status/:email', async (req, res) => {
  res.json({ plan: 'growth', pages: 3, expires: '2026-05-23' });
});

// AI page generation endpoint
app.post('/api/generate', async (req, res) => {
  const { product, audience, features } = req.body;
  const template = generatePage(product, audience);
  res.json({
    success: true,
    page: {
      headline: product ? `Launch ${product} Faster Than Ever` : 'Build Something Amazing',
      cta: 'Get Started Free',
      color: template.color,
      sections: ['hero', 'features', 'pricing', 'testimonials', 'faq', 'cta'],
      html: '<!-- AI generated page -->'
    }
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve React app for all other routes - Express 5 compatible
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 PagePilot running on port ${PORT}`);
  console.log(`   Stripe configured: ${stripe ? 'YES' : 'NO'}`);
});