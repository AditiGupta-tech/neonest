import dbConnect from "../../../lib/db.js";
import User from "../../../models/User.model.js";
import jwt from "jsonwebtoken";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    const auth = req.headers.get('authorization') || req.headers.get('Authorization');
    if (!auth || !auth.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    const token = auth.split(' ')[1];
    const secret = process.env.JWT_SECRET || process.env.NEXT_PUBLIC_JWT_SECRET;
    if (!secret) {
      return new Response(JSON.stringify({ error: 'Server misconfiguration: missing JWT secret' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }

    let payload;
    try {
      payload = jwt.verify(token, secret);
    } catch (e) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    await dbConnect();

    // Support several common claim keys
    const id = payload.id || payload._id || payload.userId;
    const email = payload.email;

    let user;
    if (id) {
      user = await User.findById(id).select('-password').lean();
    }
    if (!user && email) {
      user = await User.findOne({ email }).select('-password').lean();
    }
    if (!user) {
      return new Response(JSON.stringify({ error: 'User not found' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
    }

    return new Response(JSON.stringify({ user }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message || 'Unexpected error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
