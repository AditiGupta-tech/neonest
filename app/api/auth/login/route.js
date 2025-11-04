import User from "@/app/models/User.model";
import connectDB from "@/lib/connectDB";
import bcryptjs from "bcryptjs";
import jwt from 'jsonwebtoken';
import { withSecurity, validateAndSanitizeInput } from "@/lib/security";

async function loginHandler(req) {
  await connectDB();
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return Response.json(
        { error: "Please provide all details" },
        { status: 422 }
      );
    }

    // Validate and sanitize inputs
    if (!validateAndSanitizeInput(email, 'string', 254) || 
        !validateAndSanitizeInput(password, 'string', 128)) {
      return Response.json(
        { error: "Invalid input format" },
        { status: 400 }
      );
    }

    // Additional email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return Response.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    const userExists = await User.findOne({ email: email.toLowerCase().trim() });
    if (!userExists) {
      return Response.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const hashPass = await bcryptjs.compare(password, userExists.password);
    if (!hashPass) {
      return Response.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      {
        id: userExists._id,
        email: userExists.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Remove sensitive data from response
    const { password: _, ...safeUserData } = userExists.toObject();

    return Response.json(
      {
        success: "Login successful!",
        user: safeUserData,
        token,
      },
      { 
        status: 200,
        headers: {
          'X-Content-Type-Options': 'nosniff',
          'X-Frame-Options': 'DENY',
          'X-XSS-Protection': '1; mode=block'
        }
      }
    );
  } catch (error) {
    console.error('Login error:', error);
    return Response.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
}

// Apply security middleware
export const POST = withSecurity(loginHandler);