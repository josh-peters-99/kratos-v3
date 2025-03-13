import { connectDB } from "@/lib/db";
import Exercise from "@/models/exercise";
import { NextResponse } from "next/server";

export async function PUT(req, { params }) {
  try {
    await connectDB();
    const { id } = params;
    const updatedExercise = await Exercise.findByIdAndUpdate(id, await req.json(), { new: true });
    return NextResponse.json(updatedExercise, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const { id } = params;
    await Exercise.findByIdAndDelete(id);
    return NextResponse.json({ message: "Exercise deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
