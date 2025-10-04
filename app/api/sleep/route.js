// app/api/sleep/route.js
import { NextResponse } from "next/server";
import Sleep from "@models/Sleep.model";
import connectDB from "@lib/connectDB";
import { authenticateToken } from "@lib/auth";

export async function POST(req) {
  await connectDB();
  const user = await authenticateToken(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();

  try {
    const newSleepLog = await Sleep.create({
      ...body,
      userId: user.user.id,
    });
    return NextResponse.json(newSleepLog, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function GET(req) {
  await connectDB();
  const user = await authenticateToken(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const sleeps = await Sleep.find({ userId: user.user.id }).sort({ time: 1 });

  return NextResponse.json(sleeps);
}
