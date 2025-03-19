import { connectDB } from "@/lib/db";
import Set from "@/models/set";
import { NextResponse } from "next/server";

export async function PUT(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const updatedSet = await Set.findByIdAndUpdate(id, await req.json(), { new: true });
    return NextResponse.json(updatedSet, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const deletedSet = await Set.findByIdAndDelete(id);

    if (!deletedSet) return NextResponse.json({ error: "Set not found" }, { status: 404 });

    return NextResponse.json({ message: "Set deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
