"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";

export default function SignIn() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        await signIn("credentials", { email, password, redirect: true, callbackUrl: "/" });
    };

    return (
        <section className="w-full flex flex-col justify-center items-center px-10 py-5">
            <h1>Sign In</h1>
            <form onSubmit={handleSubmit} className="flex flex-col w-full gap-8 md:w-[500px]">
                <input 
                    type="email" 
                    value={email} 
                    name="email"
                    onChange={(e) => setEmail(e.target.value)} 
                    placeholder="Email"
                    required 
                />
                <input 
                    type="password" 
                    value={password} 
                    name="password"
                    onChange={(e) => setPassword(e.target.value)} 
                    placeholder="Password" 
                    required
                />
                <p>Don't have an account? <Link href="/auth/signup" className="underline">Sign Up</Link></p>
                <button type="submit" className="bg-white text-black rounded-md px-6 py-3 font-bold">Sign In</button>
            </form>
        </section>
    );
}