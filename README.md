# CookVerse Backend API

A comprehensive backend API for the CookVerse cooking recipe website built with Node.js, Express, and MongoDB.

## 🚀 Features

- **User Authentication**: JWT-based authentication with registration and login
- **Recipe Management**: CRUD operations for recipes with categories and search
- **Subscription System**: Free, Standard, and Premium tiers with different access levels
- **Favorites System**: Users can save and manage favorite recipes
- **Notifications**: Real-time notifications for users
- **Search & Filtering**: Advanced search with category and difficulty filters
- **Security**: Rate limiting, CORS, helmet security headers
- **Data Validation**: Input validation using express-validator

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cookverse-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   MONGODB_URI=mongodb://localhost:27017/cookverse
   JWT_SECRET=your_super_secret_jwt_key_here
   PORT=5000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:3000
   ```

4. **Start MongoDB**
   - Local: Make sure MongoDB is running on your system
   - Atlas: Use your MongoDB Atlas connection string

5. **Seed the database** (optional)
   ```bash
   npm run seed
   ```

6. **Start the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user

### Recipes
- `GET /api/recipes` - Get all recipes (with pagination & filtering)
- `GET /api/recipes/featured` - Get featured recipes
- `GET /api/recipes/category/:category` - Get recipes by category
- `GET /api/recipes/:id` - Get single recipe
- `POST /api/recipes/search` - Search recipes

### User Management
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `GET /api/user/favorites` - Get user's favorite recipes
- `POST /api/user/favorites/:recipeId` - Add recipe to favorites
- `DELETE /api/user/favorites/:recipeId` - Remove recipe from favorites
- `PUT /api/user/password` - Change password

### Subscriptions
- `GET /api/subscriptions/plans` - Get available subscription plans
- `GET /api/subscriptions/status` - Get user's subscription status
- `POST /api/subscriptions/upgrade` - Upgrade subscription
- `GET /api/subscriptions/features` - Get available features

### Notifications
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/:id/read` - Mark notification as read
- `PUT /api/notifications/read-all` - Mark all notifications as read
- `DELETE /api/notifications/:id` - Delete notification
- `GET /api/notifications/unread-count` - Get unread count

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## 📊 Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  subscription: String, // 'free', 'standard', 'premium'
  dietaryPreferences: [String],
  favorites: [ObjectId],
  isActive: Boolean,
  lastLogin: Date
}
```

### Recipe Model
```javascript
{
  title: String,
  description: String,
  category: String,
  ingredients: [{ name, amount, unit }],
  instructions: [{ step, description }],
  prepTime: Number,
  cookTime: Number,
  servings: Number,
  difficulty: String, // 'easy', 'medium', 'hard'
  imageUrl: String,
  youtubeUrl: String,
  isPremium: Boolean,
  tags: [String],
  nutrition: { calories, protein, carbs, fat, fiber },
  rating: { average, count },
  views: Number
}
```

### Notification Model
```javascript
{
  userId: ObjectId,
  title: String,
  message: String,
  type: String, // 'course', 'recipe', 'subscription', 'system'
  isRead: Boolean,
  actionUrl: String,
  priority: String // 'low', 'medium', 'high'
}
```

## 🎯 Subscription Tiers

### Free
- Access to basic recipes
- Limited recipe categories
- Basic search functionality

### Standard ($9.99/month)
- Access to all recipes
- Save favorites
- Create recipe collections
- Advanced search filters
- Nutritional information

### Premium ($19.99/month)
- All Standard features
- Recipe downloads
- Live cooking classes
- Exclusive expert content
- Priority customer support

## 🧪 Testing

Test the API using tools like Postman or curl:

```bash
# Health check
curl http://localhost:5000/api/health

# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'

# Get recipes
curl http://localhost:5000/api/recipes
```

## 🚀 Deployment

1. **Environment Variables**: Set production environment variables
2. **Database**: Use MongoDB Atlas for production
3. **Security**: Use strong JWT secrets and enable HTTPS
4. **Monitoring**: Add logging and monitoring tools

## 📝 Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run seed` - Seed database with sample recipes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, email support@cookverse.com or create an issue in the repository.
