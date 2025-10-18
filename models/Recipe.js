const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Recipe title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Recipe description is required'],
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['indian', 'italian', 'healthy', 'desserts', 'fastfood', 'japanese', 'mexican', 'chinese', 'mediterranean']
  },
  ingredients: [{
    name: {
      type: String,
      required: true
    },
    amount: {
      type: String,
      required: true
    },
    unit: {
      type: String,
      default: ''
    }
  }],
  instructions: [{
    step: {
      type: Number,
      required: true
    },
    description: {
      type: String,
      required: true
    }
  }],
  prepTime: {
    type: Number,
    required: [true, 'Preparation time is required'],
    min: [1, 'Preparation time must be at least 1 minute']
  },
  cookTime: {
    type: Number,
    required: [true, 'Cooking time is required'],
    min: [1, 'Cooking time must be at least 1 minute']
  },
  servings: {
    type: Number,
    required: [true, 'Number of servings is required'],
    min: [1, 'Servings must be at least 1']
  },
  difficulty: {
    type: String,
    required: [true, 'Difficulty level is required'],
    enum: ['easy', 'medium', 'hard']
  },
  imageUrl: {
    type: String,
    required: [true, 'Image URL is required']
  },
  youtubeUrl: {
    type: String,
    validate: {
      validator: function(v) {
        return !v || /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\/.+/.test(v);
      },
      message: 'Please provide a valid YouTube URL'
    }
  },
  isPremium: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String,
    trim: true
  }],
  nutrition: {
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number,
    fiber: Number
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  views: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  }
}, {
  timestamps: true
});

// Index for search functionality
recipeSchema.index({ title: 'text', description: 'text', tags: 'text' });
recipeSchema.index({ category: 1 });
recipeSchema.index({ isPremium: 1 });
recipeSchema.index({ rating: -1 });

// Virtual for total time
recipeSchema.virtual('totalTime').get(function() {
  return this.prepTime + this.cookTime;
});

// Method to increment views
recipeSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

module.exports = mongoose.model('Recipe', recipeSchema);
