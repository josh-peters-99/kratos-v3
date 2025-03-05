"use client";

import { useState } from "react";
import Link from "next/link";

export default function SignUp() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await fetch("/api/auth/signup", {
            method: "POST",
            body: JSON.stringify({ username, email, password }),
        });

        if (res.ok) {
            alert("Signup successful. You can now sign in.");
        } else {
            alert("Signup failed.");
        }
    };

    return (
        <section className="w-full flex flex-col justify-center items-center px-10 py-5">
            <h1>Sign Up</h1>
            <form onSubmit={handleSubmit} className="flex flex-col w-full gap-8 md:w-[500px]">
                <input 
                    type="text" 
                    value={username} 
                    name="username"
                    onChange={(e) => setUsername(e.target.value)} 
                    placeholder="Username" 
                    required 
                />
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

                <p>Already have an account? <Link href="/auth/signin" className="underline">Sign In</Link></p>

                <button type="submit" className="bg-white text-black rounded-md px-6 py-3 font-bold">Sign Up</button>
            </form>
        </section>
    )
}