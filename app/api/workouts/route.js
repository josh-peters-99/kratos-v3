import { connectDB } from "@/lib/db";
import Workout from "@/models/workout";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
      await connectDB();
      const { title, date, notes } = await req.json();
      const newWorkout = new Workout({ user: session.user.id, title, date, notes });
      await newWorkout.save();

      return NextResponse.json(newWorkout, { status: 201 });
  } catch (error) {
      return NextResponse.json({ error: "Failed to create workout" }, { status: 500 });
  }
}

export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
      await connectDB();
      const workouts = await Workout.find({ user: session.user.id });
      return NextResponse.json(workouts);
  } catch (error) {
      return NextResponse.json({ error: "Failed to fetch workouts" }, { status: 500 });
  }
}