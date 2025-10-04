import User from "@models/User.model";
import connectDB from "@lib/connectDB";
import bcryptjs from "bcryptjs";
import jwt from 'jsonwebtoken'

export async function POST(req) {
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

    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (!userExists) {
      return Response.json(
        { error: "no such user exists! signup instead" },
        { status: 422 }
      );
    }

    const hashPass = await bcryptjs.compare(password , userExists.password);
    if(!hashPass){
      return Response.json(
        { error: "wrong password" },
        { status: 400 }
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

    return Response.json(
      {
        success: "login Successful!",
        userExists,
        token,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}