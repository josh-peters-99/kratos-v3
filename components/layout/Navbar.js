"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { createWorkout } from "@/lib/api/workouts";

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const { data: session, status } = useSession();
    const [mounted, setMounted] = useState(false);
    const router = useRouter();

    // Ensure component is mounted before accessing session to prevent hydration errors
    useEffect(() => {
        setMounted(true);
    }, []);

    // Toggle menu state
    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
        document.body.style.overflow = menuOpen ? "auto" : "hidden";
    };

    const handleCreateWorkout = async () => {
        try {
            const newWorkout = await createWorkout({ title: "New Workout", date: new Date(), notes: "" });
            router.push(`/workouts/${newWorkout._id}`);
        } catch (error) {
            console.error("Failed to create workout:", error);
        }
    }

    return (
        <nav className="flex w-full justify-between items-center px-6 h-[80px]">
            {/* Logo */}
            <Link href="/" className="flex items-center cursor-pointer">
                <div className="flex items-center">
                    <h1>KRATOS</h1>
                </div>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex gap-6 text-lg items-center">
                <Link href="/">Home</Link>
                {/* <Link href="/workouts/new">Log Workout</Link> */}
                <button onClick={handleCreateWorkout} className="cursor-pointer">Log Workout</button>
                {mounted && status !== "loading" && (
                    session ? (
                        <button onClick={() => signOut()} className="cursor-pointer">Sign Out</button>
                    ) : (
                        <Link href="/auth/signin" className="cursor-pointer">Sign In</Link>
                    )
                )}
            </div>

            {/* Mobile Menu Toggle */}
            <div className="md:hidden z-50" onClick={toggleMenu}>
                {menuOpen ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8 absolute top-6 right-6 z-50">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                  
                ) : (
                    // Menu Icon
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                    </svg>
                )}
            </div>

            {/* Mobile Menu Overlay */}
            {menuOpen && (
                <div className="fixed top-0 right-0 w-full h-screen bg-black flex flex-col items-center justify-center gap-8 text-white text-2xl z-40">
                    <Link href="/" onClick={toggleMenu}>Home</Link>
                    {/* <Link href="/workout" onClick={toggleMenu}>Log Workout</Link> */}
                    <button onClick={() => { handleCreateWorkout(); toggleMenu(); }} className="cursor-pointer">
                        Log Workout
                    </button>

                    {mounted && status !== "loading" && (
                        session ? (
                            <button
                                onClick={() => {
                                    signOut();
                                    toggleMenu();
                                }}
                                className="bg-white text-black rounded-md px-6 py-3 font-bold"
                            >
                                Sign Out
                            </button>
                        ) : (
                            <Link 
                                href="/auth/signin" 
                                onClick={toggleMenu}
                                className="bg-white text-black rounded-md px-6 py-3 font-bold"
                            >
                                Sign In
                            </Link>
                        )
                    )}
                </div>
            )}
        </nav>
    );
}