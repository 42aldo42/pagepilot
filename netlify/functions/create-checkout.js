const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { plan, email } = JSON.parse(event.body);
    
    const prices = {
      starter: { amount: 0, name: 'Starter' },
      growth: { amount: 4900, name: 'Growth' },
      scale: { amount: 14900, name: 'Scale' }
    };

    const selectedPlan = prices[plan] || prices.growth;

    if (selectedPlan.amount === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Free plan does not need checkout' })
      };
    }

    // Create a Price object first
    const stripePrice = await stripe.prices.create({
      unit_amount: selectedPlan.amount,
      currency: 'usd',
      recurring: { interval: 'month' },
      product_data: {
        name: `PagePilot ${selectedPlan.name}`
      },
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price: stripePrice.id,
        quantity: 1,
      }],
      mode: 'subscription',
      customer_email: email,
      success_url: `${event.headers.origin || 'https://graceful-caramel-f3216a.netlify.app'}/?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${event.headers.origin || 'https://graceful-caramel-f3216a.netlify.app'}/?canceled=true`,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ url: session.url })
    };
  } catch (err) {
    console.error('Stripe error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
