# CookVerse Setup Guide

## 🚀 Quick Start

Follow these steps to get your CookVerse application running with the new backend integration.

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- A modern web browser

### Step 1: Backend Setup

1. **Install Backend Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment Variables**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` file:
   ```env
   MONGODB_URI=mongodb://localhost:27017/cookverse
   JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
   PORT=5000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:3000
   ```

3. **Start MongoDB**
   - **Local**: Make sure MongoDB is running on your system
   - **Atlas**: Use your MongoDB Atlas connection string in `.env`

4. **Seed the Database**
   ```bash
   npm run seed
   ```
   This will populate your database with sample recipes.

5. **Start the Backend Server**
   ```bash
   npm run dev
   ```
   The API will be available at `http://localhost:5000`

### Step 2: Frontend Setup

1. **Serve the Frontend**
   Since this is a static website, you can serve it using any static file server:
   
   **Option A: Using Python (if installed)**
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Python 2
   python -m SimpleHTTPServer 8000
   ```
   
   **Option B: Using Node.js http-server**
   ```bash
   npm install -g http-server
   http-server -p 8000
   ```
   
   **Option C: Using Live Server (VS Code Extension)**
   - Install "Live Server" extension in VS Code
   - Right-click on `index.html` and select "Open with Live Server"

2. **Access the Application**
   Open your browser and go to `http://localhost:8000`

### Step 3: Test the Application

1. **Create an Account**
   - Go to the signup page
   - Create a new account with your email and password

2. **Login**
   - Use your credentials to login
   - You should be redirected to the dashboard

3. **Explore Features**
   - Browse recipes by category
   - Use the search functionality
   - Check your subscription status
   - Try upgrading your subscription

## 🔧 Configuration

### Backend Configuration

The backend can be configured through environment variables:

- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT tokens (make it long and random)
- `PORT`: Port for the API server (default: 5000)
- `NODE_ENV`: Environment (development/production)
- `FRONTEND_URL`: Frontend URL for CORS (default: http://localhost:3000)

### Frontend Configuration

The frontend is configured to connect to the backend API at `http://localhost:5000`. If you change the backend port, update the `baseURL` in `api.js`:

```javascript
// In api.js
constructor() {
  this.baseURL = 'http://localhost:5000/api'; // Change port if needed
}
```

## 📊 Database Schema

The application uses three main collections:

### Users
- Authentication and profile information
- Subscription status
- Favorite recipes

### Recipes
- Recipe details, ingredients, instructions
- Categories and tags
- Premium content flags

### Notifications
- User notifications
- System messages

## 🧪 Testing the API

You can test the API endpoints using curl or Postman:

```bash
# Health check
curl http://localhost:5000/api/health

# Register a user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'

# Get recipes (replace TOKEN with actual token)
curl -H "Authorization: Bearer TOKEN" http://localhost:5000/api/recipes
```

## 🚨 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Make sure MongoDB is running
   - Check the connection string in `.env`
   - Verify MongoDB is accessible

2. **CORS Errors**
   - Make sure the frontend URL in `.env` matches your frontend server
   - Check that the backend is running on the correct port

3. **Authentication Issues**
   - Clear browser localStorage: `localStorage.clear()`
   - Check that JWT_SECRET is set in `.env`
   - Verify the token is being sent in requests

4. **Recipe Not Loading**
   - Make sure you've run `npm run seed` to populate the database
   - Check the backend logs for errors
   - Verify the API is responding at `http://localhost:5000/api/health`

### Logs

Check the backend console for error messages. The server will log:
- Database connection status
- API requests and responses
- Error details

## 🔄 Development Workflow

1. **Backend Changes**
   - Modify files in the backend
   - The server will auto-restart with `npm run dev`
   - Test changes using the API endpoints

2. **Frontend Changes**
   - Modify HTML, CSS, or JavaScript files
   - Refresh the browser to see changes
   - Check browser console for JavaScript errors

3. **Database Changes**
   - Modify models in `models/` directory
   - Update seed data in `scripts/seedRecipes.js`
   - Re-run `npm run seed` if needed

## 📝 Next Steps

After getting the basic setup working, you can:

1. **Add More Recipes**: Extend the seed script with more recipe data
2. **Implement Payment**: Integrate Stripe or PayPal for real subscriptions
3. **Add Features**: User reviews, recipe ratings, social features
4. **Deploy**: Deploy to cloud platforms like Heroku, AWS, or Vercel
5. **Mobile App**: Create a React Native or Flutter mobile app

## 🆘 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review the backend logs for error messages
3. Verify all prerequisites are installed
4. Make sure all services are running on the correct ports

The application is now fully functional with a complete backend API and integrated frontend!
