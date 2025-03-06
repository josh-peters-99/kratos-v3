import { connectDB } from "@/lib/db";
import Set from "@/models/set";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDB();
    const { exercise, count, reps, weight } = await req.json();
    const set = new Set({ exercise, count, reps, weight });
    await set.save();
    return NextResponse.json(set, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();
    const sets = await Set.find().populate("exercise");
    return NextResponse.json(sets, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}