# Environment Setup Guide

## Required Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/neonest
# or for MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/neonest

# JWT Secret (generate a strong secret)
JWT_SECRET=your-super-secret-jwt-key-here

# Google Gemini API (for AI features)
GEMINI_API_KEY=your-gemini-api-key-here
```

## How to Get These Values

### 1. MongoDB URI
- **Local MongoDB**: `mongodb://localhost:27017/neonest`
- **MongoDB Atlas**: Get from your MongoDB Atlas dashboard
- **Other**: Use your MongoDB connection string

### 2. JWT Secret
Generate a strong secret key:
```bash
# Option 1: Use Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Option 2: Use online generator
# Visit: https://generate-secret.vercel.app/64
```

### 3. Gemini API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the key to your `.env.local` file

## Quick Setup

1. Copy the example above
2. Replace the placeholder values with your actual values
3. Save as `.env.local` in the project root
4. Restart your development server

## Troubleshooting

### Common Issues:
- **"MongoDB connection failed"**: Check your MONGODB_URI
- **"JWT_SECRET is not defined"**: Make sure JWT_SECRET is set
- **"Invalid token"**: Regenerate your JWT_SECRET
- **"API key invalid"**: Check your GEMINI_API_KEY

### Testing the Setup:
1. Start the server: `npm run dev`
2. Try to sign up a new user
3. Try to log in with the created user
4. Check if notifications work

## Security Notes

- Never commit your `.env.local` file to version control
- Use strong, unique secrets for production
- Rotate API keys regularly
- Use environment-specific configurations for different deployments 