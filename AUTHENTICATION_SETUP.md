# Supabase Authentication Setup

This project now uses **Supabase** for authentication instead of custom JWT-based auth.

## ✅ What's Been Implemented

### 1. **Authentication Pages**
- **Login Page** (`/Login`) - Sign in with email and password
- **Signup Page** (`/Signup`) - Create new account with email verification
- **Forgot Password** (`/forgot-password`) - Request password reset email
- **Reset Password** (`/reset-password`) - Update password after email link
- **Profile Page** (`/profile`) - View and edit user profile

### 2. **Features**
- ✅ Email/Password authentication
- ✅ Email verification on signup
- ✅ Password reset functionality
- ✅ Profile management (name, phone, bio)
- ✅ Password change from profile
- ✅ Session management with auto-refresh
- ✅ Protected routes (auto-redirect to login)
- ✅ Responsive design for all screen sizes
- ✅ Dark mode support

### 3. **User Interface**
- **Navbar**: Shows user profile dropdown when logged in
- **Sidebar**: Displays user info (email, name, avatar) when menu is opened
- **Profile Card**: Avatar circle with first letter of name/email
- **Quick Access**: "View Profile" button in sidebar
- **Dropdown Menu**: Profile link and logout in navbar

## 🔧 Environment Variables

The following environment variables are set in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://gtljyikvqzdsltforksj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 📁 File Structure

```
app/
├── Login/
│   └── page.js          # Login page with Supabase auth
├── Signup/
│   └── page.js          # Signup page with email verification
├── forgot-password/
│   └── page.js          # Password reset request page
├── reset-password/
│   └── page.js          # New password entry page
├── profile/
│   └── page.js          # User profile management page
├── context/
│   └── AuthContext.js   # Supabase auth context provider
└── components/
    └── Navbar.js        # Updated with profile dropdown and sidebar

lib/
└── supabase.js          # Supabase client configuration
```

## 🚀 How to Use

### For Users:
1. **Sign Up**: Go to `/Signup` and create an account
2. **Verify Email**: Check your email and click the verification link
3. **Sign In**: Go to `/Login` and enter credentials
4. **Profile**: Click your name/avatar in navbar or sidebar to access profile
5. **Update Info**: Edit name, phone, bio from profile page
6. **Change Password**: Use the password section in profile
7. **Logout**: Click logout in dropdown or sidebar

### For Developers:

**Access user data:**
```javascript
import { useAuth } from '../context/AuthContext';

function MyComponent() {
  const { user, isAuth, session } = useAuth();
  
  // User object contains:
  // - user.email
  // - user.user_metadata.name
  // - user.user_metadata.phone
  // - user.user_metadata.bio
}
```

**Sign up a user:**
```javascript
const { signUp } = useAuth();
const { data, error } = await signUp(email, password, { name: 'John Doe' });
```

**Sign in a user:**
```javascript
const { signIn } = useAuth();
const { data, error } = await signIn(email, password);
```

**Update user profile:**
```javascript
const { updateUserData } = useAuth();
const { data, error } = await updateUserData({ name, phone, bio });
```

## 🎨 UI Components

### Profile Dropdown (Navbar)
- Avatar with first letter
- User name and email
- "My Profile" link
- Logout button

### Sidebar Profile Card
- Gradient avatar circle
- User name and email
- "View Profile" button
- Logout button at bottom

### Profile Page Sections
- Email (read-only)
- Full name (editable)
- Phone number (editable)
- Bio/About (editable)
- Account info (member since date)
- Password change form

## 🔐 Security Notes

- Passwords are hashed by Supabase (never stored in plain text)
- Email is not editable for security reasons
- Session tokens are automatically managed
- Password must be at least 6 characters
- Email verification required on signup

## 📱 Responsive Design

All pages work perfectly on:
- 📱 Mobile (320px+)
- 📱 Tablet (768px+)
- 💻 Desktop (1024px+)
- 🖥️ Large screens (1440px+)

## 🌙 Dark Mode

Complete dark mode support:
- Automatic theme detection
- Manual toggle in navbar
- Consistent across all auth pages
- Profile page fully dark mode compatible

## ⚠️ Important Notes

1. **Email Verification**: Users must verify their email before they can log in
2. **Password Reset**: Reset links expire after 1 hour
3. **Profile Updates**: Name, phone, and bio are stored in `user_metadata`
4. **Email Changes**: Not currently supported (Supabase limitation without additional setup)

## 🆘 Troubleshooting

**Profile not showing?**
- Make sure you're logged in
- Navigate to `/profile` directly
- Check browser console for errors

**Can't log in?**
- Verify your email first
- Check password is at least 6 characters
- Clear browser cache and try again

**Profile dropdown not closing?**
- Click outside the dropdown
- It should close automatically

---

**Built with**: Next.js 15, Supabase, TailwindCSS, Lucide Icons
