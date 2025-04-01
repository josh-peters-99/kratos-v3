"use client"

import { useState } from "react";

export default function BodyweightExerciseCard() {
    const [name, setName] = useState(exerciseName);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    return (
        <div className="mb-8">
            <div>
                <div className="bg-gray-800 rounded-md p-3 mt-1">
                    <div>
                        <div className="w-full flex justify-between items-center">
                            <label htmlFor="exerciseName" className="text-sm">Exercise Name:</label>
                            <button onClick={() => {
                                // handleDeleteExercise();
                                setIsDialogOpen(true);
                            }} className="text-sm text-red-400 cursor-pointer">
                                Delete
                            </button>
                        </div>
                        <div className="flex items-center">
                            <input
                                type="text"
                                id="exerciseName"
                                value={name}
                                onChange={handleExerciseNameChange}
                                className="mt-2 bg-gray-900 w-full h-12 rounded-tl-sm rounded-bl-sm"
                            />
                            {dropdownOpen ? (
                                <button onClick={() => setDropdownOpen(!dropdownOpen)} className="cursor-pointer w-12 h-12 flex justify-center items-center rounded-tr-sm rounded-br-sm bg-gray-900 mt-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-6">
                                        <path fillRule="evenodd" d="M9.47 6.47a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 1 1-1.06 1.06L10 8.06l-3.72 3.72a.75.75 0 0 1-1.06-1.06l4.25-4.25Z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            ) : (
                                <button onClick={() => setDropdownOpen(!dropdownOpen)} className="cursor-pointer w-12 h-12 flex justify-center items-center rounded-tr-sm rounded-br-sm bg-gray-900 mt-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-6">
                                        <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}