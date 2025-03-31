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
    const exerciseId = searchParams.get("exercise");

    if (!workoutId && !exerciseId) {
      return NextResponse.json({ error: "Workout ID or Exercise ID is required" }, { status: 400 });
    }

    let query = {};
    if (workoutId) query.workout = workoutId;
    if (exerciseId) query.exercise = exerciseId;

    // const sets = await Set.find({ workout: workoutId });
    const sets = await Set.find(query);

    return NextResponse.json(sets, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}