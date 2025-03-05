"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const { data: session, status } = useSession();
    const [mounted, setMounted] = useState(false);

    // Ensure component is mounted before accessing session to prevent hydration errors
    useEffect(() => {
        setMounted(true);
    }, []);

    // Toggle menu state
    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
        document.body.style.overflow = menuOpen ? "auto" : "hidden";
    };

    return (
        <nav className="flex w-full justify-between items-center px-6 h-[80px]">
            {/* Logo */}
            <Link href="/" className="flex items-center cursor-pointer">
                <div className="flex items-center">
                    {/* <img src="/greek-emperor.png" width={75} height={75} alt="Logo" /> */}
                    <h1>KRATOS</h1>
                </div>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex gap-6 text-lg font-bold items-center">
                <Link href="/">Home</Link>
                <Link href="/workout">Workout</Link>
                {mounted && status !== "loading" && (
                    session ? (
                        <button onClick={() => signOut()}>Sign Out</button>
                    ) : (
                        <Link href="/auth/signin">Sign In</Link>
                    )
                )}
            </div>

            {/* Mobile Menu Toggle */}
            <div className="md:hidden z-50" onClick={toggleMenu}>
                {menuOpen ? (
                    // Close Icon
                    // <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" className="w-8 h-8 text-white fill-current absolute top-6 right-6 z-50">
                    //     <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/>
                    // </svg>
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
                <div className="fixed top-0 right-0 w-full h-screen bg-black flex flex-col items-center justify-center gap-8 text-white font-bold text-2xl z-40">
                    <Link href="/" onClick={toggleMenu}>Home</Link>
                    <Link href="/workout" onClick={toggleMenu}>Log Workout</Link>

                    {mounted && status !== "loading" && (
                        session ? (
                            <button
                                onClick={() => {
                                    signOut();
                                    toggleMenu();
                                }}
                            >
                                Sign Out
                            </button>
                        ) : (
                            <Link href="/auth/signin" onClick={toggleMenu}>Sign In</Link>
                        )
                    )}
                </div>
            )}
        </nav>
    );
}