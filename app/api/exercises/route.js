import { connectDB } from "@/lib/db";
import Exercise from "@/models/exercise";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDB();
    const { workout, name } = await req.json();
    const exercise = new Exercise({ workout, name });
    await exercise.save();
    return NextResponse.json(exercise, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// export async function GET() {
//   try {
//     await connectDB();
//     const exercises = await Exercise.find().populate("workout");
//     return NextResponse.json(exercises, { status: 200 });
//   } catch (error) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }

// WORKING HERE
export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const workoutId = searchParams.get("workoutId");

    if (!workoutId) {
      return NextResponse.json({ error: "Workout ID is required" }, { status: 400 });
    }

    const exercises = await Exercise.find({ workout: workoutId });

    return NextResponse.json(exercises, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const workoutId = searchParams.get("workoutId");

    if (!workoutId) {
      return NextResponse.json({ error: "Workout ID is required" }, { status: 400 });
    }

    const result = await Exercise.deleteMany({ workout: workoutId });

    return NextResponse.json({ message: "Exercises deleted", deletedCount: result.deletedCount }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}