const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const { plan, email } = JSON.parse(event.body);
    const prices = { starter: 0, growth: 4900, scale: 14900 };

    if (plan === 'starter') {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ url: '/?success=true&plan=starter' })
      };
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
      success_url: `https://pagepilot.ai/?success=true&plan=${plan}`,
      cancel_url: 'https://pagepilot.ai/?canceled=true'
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ url: session.url })
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err.message })
    };
  }
};
