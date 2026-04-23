const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { plan, email } = req.body;
    
    const prices = {
      starter: { amount: 0, name: 'Starter' },
      growth: { amount: 4900, name: 'Growth' },
      scale: { amount: 14900, name: 'Scale' }
    };

    const selectedPlan = prices[plan] || prices.growth;

    if (selectedPlan.amount === 0) {
      return res.status(400).json({ error: 'Free plan does not need checkout' });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: `PagePilot ${selectedPlan.name}`,
            description: `Unlimited landing pages for ${plan === 'growth' ? '5' : 'unlimited'} pages`
          },
          unit_amount: selectedPlan.amount,
        },
        quantity: 1,
      }],
      mode: 'subscription',
      customer_email: email,
      success_url: `${req.headers.origin || 'https://graceful-caramel-f3216a.netlify.app'}/?success=true`,
      cancel_url: `${req.headers.origin || 'https://graceful-caramel-f3216a.netlify.app'}/?canceled=true`,
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error('Stripe error:', err);
    res.status(500).json({ error: err.message });
  }
};
