# 🚀 Environment Setup Guide for NeoNest

This guide will help you set up the NeoNest development environment on your local machine.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.0.0 or higher) - [Download here](https://nodejs.org/)
- **npm** (v8.0.0 or higher) or **pnpm** (recommended)
- **Git** - [Download here](https://git-scm.com/)
- **MongoDB** (local installation or MongoDB Atlas account)

## 🛠 Quick Setup

### 1. Clone the Repository

```bash
git clone https://github.com/AditiGupta-tech/neonest.git
cd neonest
```

### 2. Install Dependencies

Using npm:
```bash
npm install --legacy-peer-deps
```

Using pnpm (recommended):
```bash
pnpm install
```

### 3. Environment Variables

Create a `.env.local` file in the root directory and add the following variables:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/neonest
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/neonest

# JWT Secret (generate a secure random string)
JWT_SECRET=your-super-secure-jwt-secret-key-here

# Google Gemini AI (for chatbot features)
GOOGLE_GEMINI_API_KEY=your-gemini-api-key

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# Next.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret

# Optional: Email service (for notifications)
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@gmail.com
EMAIL_SERVER_PASSWORD=your-app-password
EMAIL_FROM=noreply@neonest.com
```

### 4. Database Setup

#### Option A: Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service
3. The app will automatically create the database and collections

#### Option B: MongoDB Atlas (Cloud)
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get your connection string and add it to `MONGODB_URI`

### 5. API Keys Setup

#### Google Gemini API (for AI features)
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add it to your `.env.local` file

#### Cloudinary (for image uploads)
1. Create a free account at [Cloudinary](https://cloudinary.com/)
2. Get your cloud name, API key, and API secret from the dashboard
3. Add them to your `.env.local` file

### 6. Run the Development Server

```bash
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔧 Development Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Fix linting issues
npm run lint:fix
```

## 📁 Project Structure

```
neonest/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── components/        # React components
│   ├── context/          # React contexts
│   ├── hooks/            # Custom hooks
│   ├── models/           # Database models
│   └── [pages]/          # App pages
├── lib/                   # Utility libraries
├── public/               # Static assets
├── utils/                # Helper functions
├── .env.local           # Environment variables
├── package.json         # Dependencies
└── README.md           # Project documentation
```

## 🐛 Troubleshooting

### Common Issues

#### 1. MongoDB Connection Error
```
Error: MongoNetworkError: failed to connect to server
```
**Solution:** 
- Ensure MongoDB is running locally, or
- Check your MongoDB Atlas connection string
- Verify network connectivity

#### 2. JWT Secret Error
```
Error: JWT secret is required
```
**Solution:** Add a strong JWT_SECRET to your `.env.local` file

#### 3. API Key Errors
```
Error: Google Gemini API key not found
```
**Solution:** Add your Google Gemini API key to `.env.local`

#### 4. Port Already in Use
```
Error: Port 3000 is already in use
```
**Solution:** 
```bash
# Kill process on port 3000
npx kill-port 3000

# Or run on different port
npm run dev -- -p 3001
```

#### 5. Node Version Issues
```
Error: Node.js version not supported
```
**Solution:** Update to Node.js v18 or higher

### Performance Tips

1. **Use pnpm** instead of npm for faster installs
2. **Enable caching** in your IDE for better performance
3. **Use TypeScript** for better development experience
4. **Install React DevTools** browser extension

## 🧪 Testing Setup

### Unit Tests (Optional)
```bash
# Install testing dependencies
npm install --save-dev jest @testing-library/react @testing-library/jest-dom

# Run tests
npm test
```

### E2E Tests (Optional)
```bash
# Install Playwright
npm install --save-dev @playwright/test

# Run E2E tests
npx playwright test
```

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy automatically on every push

### Other Platforms
- **Netlify**: Similar to Vercel
- **Railway**: Good for full-stack apps
- **Heroku**: Traditional PaaS option

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Documentation](https://react.dev/)

## 🤝 Getting Help

If you encounter any issues:

1. Check this guide first
2. Search [existing issues](https://github.com/AditiGupta-tech/neonest/issues)
3. Create a new issue with detailed information
4. Join our community discussions

## 🎉 You're Ready!

Once everything is set up, you should be able to:

- ✅ Access the app at `http://localhost:3000`
- ✅ Create user accounts
- ✅ Track baby essentials
- ✅ Use AI chat features
- ✅ Upload images and memories

Happy coding! 🚀