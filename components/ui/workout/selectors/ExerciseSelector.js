"use client";

import { useState } from "react";
import { Dumbbell, Timer, HeartPulse, BicepsFlexed } from "lucide-react";

export default function ExerciseSelector({ 
    isOpen, 
    onClose, 
    onConfirm, 
    title = "Select an Exercise Type", 
    // message = "Select an Exercise Type", 
    confirmText = "Confirm", 
    cancelText = "Cancel" 
}) {
    const [selectedType, setSelectedType] = useState(null);

    const exerciseTypes = [
        { name: "Weighted Lift", icon: <Dumbbell size={20} className="mr-2" /> },
        { name: "Bodyweight", icon: <BicepsFlexed size={20} className="mr-2" /> },
        { name: "Timed Exercise", icon: <Timer size={20} className="mr-2" /> },
        { name: "Cardio", icon: <HeartPulse size={20} className="mr-2" /> },
    ];

    if (!isOpen) return null; // Don't render if not open

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
            <div className="bg-gray-800 text-white rounded-lg shadow-lg p-6 w-80 text-center">
                <h2 className="text-lg font-bold">{title}</h2>
                {/* <p className="mt-2">{message}</p> */}

                <div>
                    <p>Choose an exercise type:</p>
                    {exerciseTypes.map((type, index) => (
                        <button
                            key={index}
                            onClick={() => setSelectedType(type.name)}
                            className={`flex w-full justify-center border px-4 py-2 mt-3 rounded cursor-pointer ${
                                selectedType === type.name
                                    ? "bg-blue-500 text-white border-2 border-blue-700"
                                    : "hover:bg-gray-300 hover:text-gray-800"
                            }`}
                        >
                           {type.icon} {type.name}
                        </button>
                    ))}
                </div>

                <div className="flex justify-around mt-4">
                    <button onClick={onClose} className="bg-gray-300 text-gray-800 px-4 py-2 rounded cursor-pointer">
                        {cancelText}
                    </button>
                    <button onClick={() => onConfirm(selectedType)} className="bg-red-500 text-white px-4 py-2 rounded cursor-pointer">
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}