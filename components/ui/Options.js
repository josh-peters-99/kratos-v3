"use client"

import { useEffect, useState, useRef } from "react"

export default function BottomSheet({ isOpen, onClose, title, children, triggerRef }) {
    const [isDesktop, setIsDesktop] = useState(false);
    const dropdownRef = useRef(null);
    const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });

    // Detect and update dropdown position on open and when window resizes
    useEffect(() => {
        const updatePosition = () => {
            if (isOpen && triggerRef?.current) {
                const rect = triggerRef.current.getBoundingClientRect();
                const dropdownWidth = 250;
    
                let leftPos = rect.right + window.scrollX - dropdownWidth;
    
                // Prevent overflow by shifting left if needed
                if (leftPos + dropdownWidth > window.innerWidth) {
                    leftPos = rect.left + window.scrollX - dropdownWidth;
                }
    
                setPosition({
                    top: rect.bottom + window.scrollY,
                    left: leftPos,
                    width: dropdownWidth,
                });
            }
        };

        // Initial position calculation
        updatePosition();

        // Add resize event listener
        window.addEventListener("resize", updatePosition);

        // Cleanup on component unmount
        return () => {
            window.removeEventListener("resize", updatePosition);
        }

    }, [isOpen, triggerRef]);

    // Detect screen size to toggle between bottom sheet (mobile) and dropdown (desktop)
    useEffect(() => {
        const handleResize = () => {
            setIsDesktop(window.innerWidth >= 768); // `md` breakpoint (768px)
        };

        handleResize(); // Run on mount
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Prevent background scrolling on mobile when bottome sheet is open
    useEffect(() => {
        if (!isDesktop) {
            document.body.style.overflow = isOpen ? "hidden" : "auto";
        }
    }, [isOpen, isDesktop]);

    // Close dropdown if clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target) && triggerRef?.current && !triggerRef.current.contains(event.target)) {
                onClose();
            }
        }

        if (isDesktop && isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen, isDesktop, onClose, triggerRef]);

    if (!isOpen) return null;

    return (
        <>
            {/* Mobile Bottom Sheet */}
            {!isDesktop ? (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-end z-50">
                    {/* Slide-up panel */}
                    <div className="w-full h-1/2 bg-background text-white rounded-t-2xl p-5 flex flex-col transition-transform duration-300 ease-in-out transform translate-y-0">
                        {/* Close Button */}
                        <button 
                            className="self-end text-2xl"
                            onClick={onClose}
                        >
                            &times;
                        </button>

                        {/* Title */}
                        {title && <h2 className="text-xl font-bold mt-3">{title}</h2>}

                        {/* Content */}
                        <div className="mt-4 flex flex-col gap-7">{children}</div>
                    </div>
                </div>
            ) : (
                // Desktop Dropdown
                <div 
                    ref={dropdownRef} 
                    style={{ top: position.top, left: position.left, width: position.width }} 
                    className="absolute bg-black text-white rounded-md shadow-lg p-4 z-50 border border-gray-400"
                >
                    {/* Title */}
                    {title && <h2 className="text-lg font-bold mb-3">{title}</h2>}

                    {/* Content */}
                    <div className="flex flex-col gap-3">{children}</div>
                </div>
            )}
        </>
    )
}