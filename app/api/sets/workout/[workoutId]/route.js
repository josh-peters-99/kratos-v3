import { connectDB } from "@/lib/db";
import Set from "@/models/set";
import { NextResponse } from "next/server";

export async function DELETE(req, { params }) {
    try {
        await connectDB();
        const { workoutId } = await params;

        const result = await Set.deleteMany({ workout: workoutId });

        return NextResponse.json(
            { message: `${result.deletedCount} sets deleted` },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}