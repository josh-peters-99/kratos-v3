import { connectDB } from "@/lib/db";
import Workout from "@/models/workout";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function PUT(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  try {
    await connectDB();
    const { id } = await params;
    const updatedWorkout = await Workout.findByIdAndUpdate(id, await req.json(), { new: true });
    return NextResponse.json(updatedWorkout, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const { id } = await params;

  const session = await getServerSession(authOptions);
  if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
      await connectDB();

      const workout = await Workout.findById(id);
      if (!workout) {
        return NextResponse.json({ error: "Workout not found" }, { status: 404 });
      }

      if (workout.user.toString() !== session.user.id) {
          return NextResponse.json({ error: "Not authorized to delete this workout" }, { status: 403 });
      }

      const result = await Workout.findByIdAndDelete(id);
      if (!result) {
        return NextResponse.json({ error: "Failed to delete workout" }, { status: 500 });
      }

      return NextResponse.json({ message: "Workout deleted" }, { status: 200 });
  } catch (error) {
      return NextResponse.json({ error: "Failed to delete workout" }, { status: 500 });
  }
}