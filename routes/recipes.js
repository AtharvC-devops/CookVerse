const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Recipe = require('../models/Recipe');
const { authenticateToken, optionalAuth, requireSubscription } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/recipes
// @desc    Get all recipes with pagination and filtering
// @access  Public
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
  query('category').optional().isIn(['indian', 'italian', 'healthy', 'desserts', 'fastfood', 'japanese', 'mexican', 'chinese', 'mediterranean']),
  query('difficulty').optional().isIn(['easy', 'medium', 'hard']),
  query('isPremium').optional().isBoolean()
], optionalAuth, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = { isActive: true };
    
    if (req.query.category) {
      filter.category = req.query.category;
    }
    
    if (req.query.difficulty) {
      filter.difficulty = req.query.difficulty;
    }

    // If user is not authenticated or has free subscription, only show non-premium recipes
    if (!req.user || req.user.subscription === 'free') {
      filter.isPremium = false;
    }

    // Search functionality
    if (req.query.search) {
      filter.$text = { $search: req.query.search };
    }

    const recipes = await Recipe.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-instructions'); // Don't include full instructions in list view

    const total = await Recipe.countDocuments(filter);

    res.json({
      recipes,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalRecipes: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Get recipes error:', error);
    res.status(500).json({
      message: 'Server error while fetching recipes'
    });
  }
});

// @route   GET /api/recipes/featured
// @desc    Get featured recipes
// @access  Public
router.get('/featured', optionalAuth, async (req, res) => {
  try {
    const filter = { isActive: true };
    
    // If user is not authenticated or has free subscription, only show non-premium recipes
    if (!req.user || req.user.subscription === 'free') {
      filter.isPremium = false;
    }

    const featuredRecipes = await Recipe.find(filter)
      .sort({ rating: -1, views: -1 })
      .limit(6)
      .select('-instructions');

    res.json({ recipes: featuredRecipes });

  } catch (error) {
    console.error('Get featured recipes error:', error);
    res.status(500).json({
      message: 'Server error while fetching featured recipes'
    });
  }
});

// @route   GET /api/recipes/category/:category
// @desc    Get recipes by category
// @access  Public
router.get('/category/:category', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 })
], optionalAuth, async (req, res) => {
  try {
    const { category } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const filter = { 
      category, 
      isActive: true 
    };

    // If user is not authenticated or has free subscription, only show non-premium recipes
    if (!req.user || req.user.subscription === 'free') {
      filter.isPremium = false;
    }

    const recipes = await Recipe.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-instructions');

    const total = await Recipe.countDocuments(filter);

    res.json({
      recipes,
      category,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalRecipes: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Get recipes by category error:', error);
    res.status(500).json({
      message: 'Server error while fetching recipes by category'
    });
  }
});

// @route   GET /api/recipes/:id
// @desc    Get single recipe by ID
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe || !recipe.isActive) {
      return res.status(404).json({
        message: 'Recipe not found'
      });
    }

    // Check if user has access to premium recipe
    if (recipe.isPremium && (!req.user || req.user.subscription === 'free')) {
      return res.status(403).json({
        message: 'Premium subscription required to view this recipe',
        requiredSubscription: 'standard'
      });
    }

    // Increment view count
    await recipe.incrementViews();

    res.json({ recipe });

  } catch (error) {
    console.error('Get recipe error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({
        message: 'Recipe not found'
      });
    }
    res.status(500).json({
      message: 'Server error while fetching recipe'
    });
  }
});

// @route   POST /api/recipes/search
// @desc    Search recipes
// @access  Public
router.post('/search', [
  body('query').notEmpty().withMessage('Search query is required'),
  body('filters').optional().isObject()
], optionalAuth, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { query, filters = {} } = req.body;
    const page = parseInt(filters.page) || 1;
    const limit = parseInt(filters.limit) || 12;
    const skip = (page - 1) * limit;

    // Build search filter
    const searchFilter = {
      isActive: true,
      $text: { $search: query }
    };

    // Add additional filters
    if (filters.category) {
      searchFilter.category = filters.category;
    }
    if (filters.difficulty) {
      searchFilter.difficulty = filters.difficulty;
    }

    // If user is not authenticated or has free subscription, only show non-premium recipes
    if (!req.user || req.user.subscription === 'free') {
      searchFilter.isPremium = false;
    }

    const recipes = await Recipe.find(searchFilter, { score: { $meta: 'textScore' } })
      .sort({ score: { $meta: 'textScore' } })
      .skip(skip)
      .limit(limit)
      .select('-instructions');

    const total = await Recipe.countDocuments(searchFilter);

    res.json({
      recipes,
      query,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalRecipes: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Search recipes error:', error);
    res.status(500).json({
      message: 'Server error while searching recipes'
    });
  }
});

// @route   POST /api/recipes/upload
// @desc    Upload a new recipe (Premium users only)
// @access  Private
router.post('/upload', [
  body('title').notEmpty().withMessage('Recipe title is required'),
  body('description').notEmpty().withMessage('Recipe description is required'),
  body('category').isIn(['indian', 'italian', 'healthy', 'desserts', 'fastfood', 'japanese', 'mexican', 'chinese', 'mediterranean']).withMessage('Invalid category'),
  body('ingredients').isArray({ min: 1 }).withMessage('At least one ingredient is required'),
  body('instructions').isArray({ min: 1 }).withMessage('At least one instruction is required'),
  body('prepTime').isInt({ min: 1 }).withMessage('Prep time must be a positive integer'),
  body('cookTime').isInt({ min: 1 }).withMessage('Cook time must be a positive integer'),
  body('servings').isInt({ min: 1 }).withMessage('Servings must be a positive integer'),
  body('difficulty').isIn(['easy', 'medium', 'hard']).withMessage('Invalid difficulty level'),
  body('imageUrl').isURL().withMessage('Valid image URL is required')
], authenticateToken, requireSubscription('premium'), async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const recipeData = {
      ...req.body,
      createdBy: req.user._id,
      isPremium: true,
      isActive: false // User-uploaded recipes need approval
    };

    const recipe = new Recipe(recipeData);
    await recipe.save();

    res.status(201).json({
      message: 'Recipe uploaded successfully! It will be reviewed before being published.',
      recipe: {
        id: recipe._id,
        title: recipe.title,
        status: 'pending_review'
      }
    });

  } catch (error) {
    console.error('Upload recipe error:', error);
    res.status(500).json({
      message: 'Server error while uploading recipe'
    });
  }
});

module.exports = router;
