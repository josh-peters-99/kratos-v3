import { connectDB } from "@/lib/db";
import Set from "@/models/set";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDB();
    const { workout, exercise, count, reps, weight } = await req.json();
    const set = new Set({ workout, exercise, count, reps, weight });
    await set.save();
    return NextResponse.json(set, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const workoutId = searchParams.get("workout");

    if (!workoutId) {
      return NextResponse.json({ error: "Workout ID is required" }, { status: 400 });
    }

    const sets = await Set.find({ workout: workoutId });

    return NextResponse.json(sets, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}