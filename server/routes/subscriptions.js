const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');

// Stripe stub — replace with real Stripe secret key in production
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || null;
let stripe = null;

if (STRIPE_SECRET_KEY) {
  stripe = require('stripe')(STRIPE_SECRET_KEY);
}

const PLANS = {
  basic: {
    name: 'SIGNAL Basic',
    price: 999,
    currency: 'usd',
    interval: 'month',
    priceId: process.env.STRIPE_BASIC_PRICE_ID || 'price_basic_stub',
  },
  pro: {
    name: 'SIGNAL Pro',
    price: 1999,
    currency: 'usd',
    interval: 'month',
    priceId: process.env.STRIPE_PRO_PRICE_ID || 'price_pro_stub',
  },
};

// GET /api/subscribe — list available plans
router.get('/', (req, res) => {
  res.json({ plans: PLANS });
});

// POST /api/subscribe — create a Stripe checkout session (stub)
router.post('/', verifyToken, async (req, res) => {
  const { plan } = req.body;

  if (!plan || !PLANS[plan]) {
    return res.status(400).json({ error: 'Invalid plan. Choose "basic" or "pro".' });
  }

  if (!stripe) {
    // Stub response when Stripe is not configured
    return res.status(200).json({
      stub: true,
      message: 'Stripe not configured. This is a stub response.',
      plan: PLANS[plan],
      userId: req.user.id,
      sessionId: `stub_session_${Date.now()}`,
      checkoutUrl: null,
    });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: PLANS[plan].priceId, quantity: 1 }],
      success_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/subscribe?success=true`,
      cancel_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/subscribe?canceled=true`,
      metadata: { userId: req.user.id, plan },
    });

    res.json({ sessionId: session.id, checkoutUrl: session.url });
  } catch (err) {
    console.error('[Stripe] Checkout session error:', err.message);
    res.status(500).json({ error: 'Failed to create checkout session.' });
  }
});

// POST /api/subscribe/webhook — Stripe webhook handler
router.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripe || !endpointSecret) {
    console.log('[Stripe] Webhook received (stub mode — not verified)');
    return res.json({ received: true, stub: true });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('[Stripe] Webhook signature error:', err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  switch (event.type) {
    case 'checkout.session.completed':
      console.log('[Stripe] Checkout session completed:', event.data.object.id);
      // TODO: update user subscription status in DB
      break;
    case 'customer.subscription.deleted':
      console.log('[Stripe] Subscription canceled:', event.data.object.id);
      // TODO: revoke user access
      break;
    default:
      console.log(`[Stripe] Unhandled event type: ${event.type}`);
  }

  res.json({ received: true });
});

module.exports = router;
