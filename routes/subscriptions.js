const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Subscription plans configuration
const SUBSCRIPTION_PLANS = {
  free: {
    name: 'Free',
    price: 0,
    features: [
      'Browse all categories',
      'View basic recipes (ingredients + steps)',
      'Access YouTube tutorial links'
    ],
    limitations: [
      'View-only: cannot save, comment, or rate',
      'No access to premium recipes'
    ]
  },
  standard: {
    name: 'Standard',
    price: 9.99,
    features: [
      'Unlimited access to all recipes',
      'Create personal collections (save/favorite recipes)',
      'Comment, rate, and review recipes'
    ],
    limitations: [
      'No exclusive premium-only recipes',
      'No advanced/long-form video tutorials'
    ]
  },
  premium: {
    name: 'Premium',
    price: 19.99,
    features: [
      'All Standard features',
      'Access to exclusive premium recipes',
      'Advanced video tutorials or exclusive content',
      'Upload your own recipes to get featured',
      'Early access to new features or recipe drops'
    ],
    limitations: []
  }
};

// @route   GET /api/subscriptions/plans
// @desc    Get available subscription plans
// @access  Public
router.get('/plans', (req, res) => {
  res.json({
    plans: SUBSCRIPTION_PLANS,
    currentUserPlan: req.user ? req.user.subscription : 'free'
  });
});

// @route   GET /api/subscriptions/status
// @desc    Get user's subscription status
// @access  Private
router.get('/status', authenticateToken, (req, res) => {
  const userPlan = SUBSCRIPTION_PLANS[req.user.subscription];
  
  res.json({
    currentPlan: req.user.subscription,
    planDetails: userPlan,
    isActive: true, // In a real app, you'd check subscription expiry
    features: userPlan.features,
    limitations: userPlan.limitations
  });
});

// @route   POST /api/subscriptions/upgrade
// @desc    Upgrade user subscription (simplified - no payment processing)
// @access  Private
router.post('/upgrade', [
  body('plan').isIn(['standard', 'premium']).withMessage('Invalid subscription plan')
], authenticateToken, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { plan } = req.body;
    const currentPlan = req.user.subscription;

    // Check if user is already on a higher or equal plan
    const planLevels = { free: 0, standard: 1, premium: 2 };
    if (planLevels[currentPlan] >= planLevels[plan]) {
      return res.status(400).json({
        message: `You are already on ${currentPlan} plan or higher`
      });
    }

    // In a real application, you would:
    // 1. Process payment through Stripe/PayPal
    // 2. Verify payment success
    // 3. Update subscription with expiry date
    // 4. Send confirmation email

    // For demo purposes, we'll just update the subscription
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { subscription: plan },
      { new: true }
    ).select('-password');

    res.json({
      message: `Successfully upgraded to ${plan} plan!`,
      newPlan: plan,
      planDetails: SUBSCRIPTION_PLANS[plan],
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        subscription: user.subscription
      }
    });

  } catch (error) {
    console.error('Upgrade subscription error:', error);
    res.status(500).json({
      message: 'Server error while upgrading subscription'
    });
  }
});

// @route   POST /api/subscriptions/redeem
// @desc    Redeem coupon code to activate a plan
// @access  Private
router.post('/redeem', [
  body('code').trim().notEmpty().withMessage('Coupon code is required')
], authenticateToken, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }

    const { code } = req.body;
    const normalized = (code || '').toUpperCase();

    // Supported coupons
    const couponToPlan = {
      'STAN100': 'standard',
      'PRUM100': 'premium'
    };

    const targetPlan = couponToPlan[normalized];
    if (!targetPlan) {
      return res.status(400).json({ message: 'Invalid coupon code' });
    }

    // Avoid downgrading via coupon
    const planLevels = { free: 0, standard: 1, premium: 2 };
    if (planLevels[req.user.subscription] >= planLevels[targetPlan]) {
      return res.status(400).json({ message: `You are already on ${req.user.subscription} plan or higher` });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { subscription: targetPlan },
      { new: true }
    ).select('-password');

    return res.json({
      message: `Coupon applied. Upgraded to ${targetPlan} plan!`,
      newPlan: targetPlan,
      planDetails: SUBSCRIPTION_PLANS[targetPlan],
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        subscription: user.subscription
      }
    });
  } catch (error) {
    console.error('Redeem coupon error:', error);
    return res.status(500).json({ message: 'Server error while redeeming coupon' });
  }
});

// @route   POST /api/subscriptions/downgrade
// @desc    Downgrade user subscription
// @access  Private
router.post('/downgrade', [
  body('plan').isIn(['free', 'standard']).withMessage('Invalid subscription plan')
], authenticateToken, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { plan } = req.body;
    const currentPlan = req.user.subscription;

    // Check if user is already on a lower or equal plan
    const planLevels = { free: 0, standard: 1, premium: 2 };
    if (planLevels[currentPlan] <= planLevels[plan]) {
      return res.status(400).json({
        message: `You are already on ${currentPlan} plan or lower`
      });
    }

    // In a real application, you would:
    // 1. Process refund if applicable
    // 2. Update subscription with new expiry date
    // 3. Send confirmation email
    // 4. Remove premium features access

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { subscription: plan },
      { new: true }
    ).select('-password');

    res.json({
      message: `Successfully downgraded to ${plan} plan`,
      newPlan: plan,
      planDetails: SUBSCRIPTION_PLANS[plan],
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        subscription: user.subscription
      }
    });

  } catch (error) {
    console.error('Downgrade subscription error:', error);
    res.status(500).json({
      message: 'Server error while downgrading subscription'
    });
  }
});

// @route   GET /api/subscriptions/features
// @desc    Get features available to user based on subscription
// @access  Private
router.get('/features', authenticateToken, (req, res) => {
  const userPlan = SUBSCRIPTION_PLANS[req.user.subscription];
  
  res.json({
    availableFeatures: userPlan.features,
    limitations: userPlan.limitations,
    canAccessPremiumRecipes: req.user.subscription !== 'free',
    canSaveFavorites: req.user.subscription !== 'free',
    canDownloadRecipes: req.user.subscription === 'premium',
    canAccessLiveClasses: req.user.subscription === 'premium'
  });
});

module.exports = router;
