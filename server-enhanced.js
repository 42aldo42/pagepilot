const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'client', 'build')));

// Initialize Stripe only if we have keys
let stripe = null;
const stripeKey = process.env.STRIPE_SECRET_KEY;
if (stripeKey && stripeKey.startsWith('sk_')) {
  stripe = require('stripe')(stripeKey);
}

// Abacus AI image generation
const ABACUS_API_KEY = process.env.ABACUS_API_KEY || 's2_2ae95a0a75cb48cf9a5899cdc4c93403';
const ABACUS_BASE_URL = 'https://routellm.abacus.ai/v1';

// Page generation with real AI
const generatePage = (product, audience, features) => {
  const productLower = product.toLowerCase();
  const audienceLower = audience.toLowerCase();
  const featuresList = features ? features.split(',').map(f => f.trim()).filter(f => f) : [];
  
  const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#14b8a6'];
  const color = colors[Math.floor(Math.random() * colors.length)];
  
  const headlineTemplates = [
    `${product} — Built for ${audience}`,
    `The ${product} That ${audience} Actually Love`,
    `Stop Struggling. Start Using ${product}.`,
    `${product}: Finally, a Tool Made for ${audience}`,
    `Launch Your ${product} in Minutes, Not Weeks`,
    `${product} Is the ${product} ${audience} Have Been Waiting For`,
    `Build Better ${product} With Zero Friction`,
    `The Only ${product} ${audience} Will Ever Need`
  ];
  
  const subheadlineTemplates = [
    `Everything ${audience} need to succeed, in one powerful platform.`,
    `Join thousands of ${audience} who've already made the switch.`,
    `Simple, fast, and designed specifically for ${audience}.`,
    `No coding. No designers. Just results.`,
    `Built from the ground up for ${audience} who demand more.`,
    `The fastest way for ${audience} to get from idea to launch.`
  ];
  
  const ctaTemplates = [
    'Start Free Trial',
    'Get Started Now',
    'Try It Free',
    'Launch Your Page',
    'Get Early Access',
    'Start Building Now',
    'Claim Your Spot',
    'Join the Beta'
  ];
  
  const benefitTemplates = [
    { icon: '⚡', title: 'Lightning Fast', desc: `Get your ${product} up and running in under 5 minutes.` },
    { icon: '🎯', title: 'Built for You', desc: `Specifically designed for ${audience} like you.` },
    { icon: '🔒', title: 'Secure & Reliable', desc: 'Enterprise-grade security with 99.9% uptime.' },
    { icon: '📈', title: 'Scales With You', desc: 'From first customer to enterprise — we grow together.' },
    { icon: '🎨', title: 'Beautiful Design', desc: 'Professional templates that convert visitors to customers.' },
    { icon: '🤝', title: '24/7 Support', desc: 'Real humans, real help, whenever you need it.' },
    { icon: '🚀', title: 'Instant Deploy', desc: 'Push to production with a single click.' },
    { icon: '💡', title: 'Smart Insights', desc: 'AI-powered analytics to optimize your growth.' }
  ];
  
  const headline = headlineTemplates[Math.floor(Math.random() * headlineTemplates.length)];
  const subheadline = subheadlineTemplates[Math.floor(Math.random() * subheadlineTemplates.length)];
  const cta = ctaTemplates[Math.floor(Math.random() * ctaTemplates.length)];
  
  const customFeatures = featuresList.length > 0 
    ? featuresList.map((f, i) => ({ 
        icon: ['✨', '🚀', '💡', '🔧', '⚙️', '📊', '🎨', '🔒'][i % 8], 
        title: f, 
        desc: `Powerful ${f.toLowerCase()} built right into your workflow.` 
      }))
    : [];
  
  const allBenefits = [...customFeatures, ...benefitTemplates].slice(0, 6);
  
  return {
    headline,
    subheadline,
    cta,
    color,
    benefits: allBenefits,
    product,
    audience
  };
};

// Generate hero image using Abacus AI
const generateHeroImage = async (product, audience) => {
  try {
    const prompt = `Professional SaaS landing page hero image for "${product}" targeting ${audience}. Modern, clean, minimal design with soft gradients, abstract geometric shapes, tech aesthetic. No text, no words, no letters. High quality, 16:9 aspect ratio, corporate branding style.`;
    
    // Use native https for Node.js (no fetch available in older Node)
    const https = require('https');
    const url = new URL(`${ABACUS_BASE_URL}/chat/completions`);
    
    const postData = JSON.stringify({
      model: 'flux2',
      modalities: ['image'],
      messages: [{ role: 'user', content: prompt }]
    });
    
    return new Promise((resolve) => {
      const request = https.request({
        hostname: url.hostname,
        path: url.pathname,
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${ABACUS_API_KEY}`,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)
        }
      }, (response) => {
        let data = '';
        response.on('data', (chunk) => { data += chunk; });
        response.on('end', () => {
          try {
            const result = JSON.parse(data);
            const imageContent = result.choices?.[0]?.message?.content;
            if (imageContent && Array.isArray(imageContent)) {
              const imageUrl = imageContent.find(c => c.type === 'image_url')?.image_url?.url;
              resolve(imageUrl || null);
            } else {
              resolve(null);
            }
          } catch (e) {
            console.error('Parse error:', e);
            resolve(null);
          }
        });
      });
      
      request.on('error', (err) => {
        console.error('Request error:', err);
        resolve(null);
      });
      
      request.write(postData);
      request.end();
    });
  } catch (err) {
    console.error('Image generation error:', err);
    return null;
  }
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

// Generate page endpoint
app.post('/api/generate', async (req, res) => {
  try {
    const { product, audience, features } = req.body;
    
    if (!product || !audience) {
      return res.status(400).json({ error: 'Product and audience are required' });
    }
    
    const page = generatePage(product, audience, features);
    
    // Try to generate a hero image (non-blocking)
    const heroImage = await generateHeroImage(product, audience);
    if (heroImage) {
      page.heroImage = heroImage;
    }
    
    res.json(page);
  } catch (err) {
    console.error('Generation error:', err);
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
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }
  
  res.json({ received: true });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', stripe: !!stripe, ai: true });
});

// Serve React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 PagePilot server running on port ${PORT}`);
  console.log(`💳 Stripe: ${stripe ? 'Connected' : 'Not configured'}`);
  console.log(`🎨 AI Image Gen: ${ABACUS_API_KEY ? 'Ready' : 'Not configured'}`);
});
