import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

export async function authenticateToken(req) {
  const authHeader = req.headers.get('authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return Response.json({ error: 'Authorization token missing or malformed' },{status : 400});
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Convert string id to ObjectId if needed
    if (decoded.id && typeof decoded.id === 'string') {
      decoded.id = new mongoose.Types.ObjectId(decoded.id);
    }
    return { user: decoded }; 
  } catch (error) {
    return { error: 'Invalid or expired token' };
  }
}
