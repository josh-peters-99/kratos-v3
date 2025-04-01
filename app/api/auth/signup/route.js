import { connectDB } from "@/lib/db";
import { NextResponse } from "next/server";
import User from "@/models/user";
import bcrypt from "bcryptjs";

export async function POST(req) {
    try {
        await connectDB();
        const { username, firstname, lastname, email, password } = await req.json();

        const exisitingUser = await User.findOne({ email });
        if (exisitingUser) {
            return Response.json({ error: "User already exists" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({ username, firstname, lastname, email, password: hashedPassword });

        return NextResponse.json({ message: "User registered successfully" }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}