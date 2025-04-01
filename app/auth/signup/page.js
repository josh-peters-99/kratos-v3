"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignUp() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await fetch("/api/auth/signup", {
            method: "POST",
            body: JSON.stringify({ username, firstname, lastname, email, password }),
        });

        if (res.ok) {
            // alert("Signup successful. You can now sign in.");
            router.push("/auth/signin");
        } else {
            alert("Signup failed.");
        }
    };

    return (
        <section className="w-full flex flex-col justify-center items-center px-10 py-5">
            <h1>Sign Up</h1>
            <form onSubmit={handleSubmit} className="flex flex-col w-full gap-6 md:w-[500px] mt-2">
                <input 
                    type="text" 
                    value={username} 
                    name="username"
                    onChange={(e) => setUsername(e.target.value)} 
                    placeholder="Username"
                    className="bg-gray-900 w-full h-12 rounded-sm"
                    required 
                />
                <input 
                    type="text" 
                    value={firstname} 
                    name="firstname"
                    onChange={(e) => setFirstname(e.target.value)} 
                    placeholder="First Name"
                    className="bg-gray-900 w-full h-12 rounded-sm"
                    required 
                />
                <input 
                    type="text" 
                    value={lastname} 
                    name="lastname"
                    onChange={(e) => setLastname(e.target.value)} 
                    placeholder="Last Name"
                    className="bg-gray-900 w-full h-12 rounded-sm"
                    required 
                />
                <input 
                    type="email" 
                    value={email} 
                    name="email"
                    onChange={(e) => setEmail(e.target.value)} 
                    placeholder="Email"
                    className="bg-gray-900 w-full h-12 rounded-sm"
                    required 
                />
                <input 
                    type="password" 
                    value={password} 
                    name="password"
                    onChange={(e) => setPassword(e.target.value)} 
                    placeholder="Password"
                    className="bg-gray-900 w-full h-12 rounded-sm"
                    required 
                />

                <p>Already have an account? <Link href="/auth/signin" className="underline">Sign In</Link></p>

                <button type="submit" className="bg-white text-black rounded-md px-6 py-3 font-bold cursor-pointer">Sign Up</button>
            </form>
        </section>
    )
}