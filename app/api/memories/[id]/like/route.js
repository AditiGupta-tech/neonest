import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

import connectDB from '@/lib/connectDB';
import { authenticateToken } from '@/lib/auth';
import Memory from '@/app/models/Memory.model';

export async function PUT(request, { params }) {
  await connectDB();
  const user = await authenticateToken(request);
  const userId = user.user.id;

  try {
    const memory = await Memory.findById(params.id);
    if (!memory) {
      return NextResponse.json(
        { message: 'Memory not found' },
        { status: 404 }
      );
    }
    const likeIndex = memory.likes.indexOf(userId);

    if (likeIndex === -1) {
      // Like the memory
      memory.likes.push(userId);
    } else {
      // Unlike the memory
      memory.likes.splice(likeIndex, 1);
    }

    await memory.save();

    return NextResponse.json({
      likes: memory.likes,
      isLiked: likeIndex === -1
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: 'Error updating like' },
      { status: 500 }
    );
  }
}