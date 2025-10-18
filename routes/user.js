const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Recipe = require('../models/Recipe');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/user/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('favorites', 'title imageUrl category')
      .select('-password');

    res.json({ user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      message: 'Server error while fetching profile'
    });
  }
});

// @route   PUT /api/user/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', [
  body('name').optional().trim().isLength({ min: 2, max: 50 }),
  body('dietaryPreferences').optional().isArray(),
  body('dietaryPreferences.*').optional().isIn(['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'keto', 'paleo', 'none'])
], authenticateToken, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, dietaryPreferences } = req.body;
    const updateData = {};

    if (name) updateData.name = name;
    if (dietaryPreferences) updateData.dietaryPreferences = dietaryPreferences;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      message: 'Profile updated successfully',
      user
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      message: 'Server error while updating profile'
    });
  }
});

// @route   GET /api/user/favorites
// @desc    Get user's favorite recipes
// @access  Private
router.get('/favorites', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate({
        path: 'favorites',
        select: 'title description imageUrl category prepTime cookTime difficulty rating',
        match: { isActive: true }
      });

    res.json({ favorites: user.favorites });
  } catch (error) {
    console.error('Get favorites error:', error);
    res.status(500).json({
      message: 'Server error while fetching favorites'
    });
  }
});

// @route   POST /api/user/favorites/:recipeId
// @desc    Add recipe to favorites
// @access  Private
router.post('/favorites/:recipeId', authenticateToken, async (req, res) => {
  try {
    const { recipeId } = req.params;

    // Check if recipe exists
    const recipe = await Recipe.findById(recipeId);
    if (!recipe || !recipe.isActive) {
      return res.status(404).json({
        message: 'Recipe not found'
      });
    }

    // Check if user has access to premium recipe
    if (recipe.isPremium && req.user.subscription === 'free') {
      return res.status(403).json({
        message: 'Premium subscription required to favorite this recipe',
        requiredSubscription: 'standard'
      });
    }

    // Check if already in favorites
    const user = await User.findById(req.user._id);
    if (user.favorites.includes(recipeId)) {
      return res.status(400).json({
        message: 'Recipe already in favorites'
      });
    }

    // Add to favorites
    user.favorites.push(recipeId);
    await user.save();

    res.json({
      message: 'Recipe added to favorites',
      recipe: {
        id: recipe._id,
        title: recipe.title,
        imageUrl: recipe.imageUrl,
        category: recipe.category
      }
    });

  } catch (error) {
    console.error('Add favorite error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({
        message: 'Recipe not found'
      });
    }
    res.status(500).json({
      message: 'Server error while adding to favorites'
    });
  }
});

// @route   DELETE /api/user/favorites/:recipeId
// @desc    Remove recipe from favorites
// @access  Private
router.delete('/favorites/:recipeId', authenticateToken, async (req, res) => {
  try {
    const { recipeId } = req.params;

    const user = await User.findById(req.user._id);
    const favoriteIndex = user.favorites.indexOf(recipeId);

    if (favoriteIndex === -1) {
      return res.status(404).json({
        message: 'Recipe not found in favorites'
      });
    }

    user.favorites.splice(favoriteIndex, 1);
    await user.save();

    res.json({
      message: 'Recipe removed from favorites'
    });

  } catch (error) {
    console.error('Remove favorite error:', error);
    res.status(500).json({
      message: 'Server error while removing from favorites'
    });
  }
});

// @route   PUT /api/user/password
// @desc    Change user password
// @access  Private
router.put('/password', [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
], authenticateToken, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { currentPassword, newPassword } = req.body;

    // Get user with password
    const user = await User.findById(req.user._id);

    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        message: 'Current password is incorrect'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      message: 'Password updated successfully'
    });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      message: 'Server error while changing password'
    });
  }
});

module.exports = router;
