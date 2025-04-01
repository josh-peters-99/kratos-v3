"use client"

import { useCallback, useState, useEffect } from "react";
import { updateSet } from "@/lib/api/sets";

export default function SetRow({ setId, count, reps, weight, onDelete, onUpdate }) {
    const [setCount, setSetCount] = useState(count);
    const [setReps, setSetReps] = useState(reps);
    const [setWeight, setSetWeight] = useState(weight);

    const debounce = (func, delay) => {
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => func(...args), delay);
        };
    };

    const handleUpdateSet = useCallback(
        debounce(async (updatedFields) => {
            try {
                await updateSet(setId, updatedFields);
                console.log("Set updated:", updatedFields);
            } catch (error) {
                console.error("Failed to update set:", error);
            }
        }, 500),
        [setId]
    )

    const handleSetRepChange = (e) => {
        const newSetRep = e.target.value;
        // setSetReps(newSetRep);
        onUpdate(setId, { reps: newSetRep });
        handleUpdateSet({ reps: newSetRep });
    }

    const handleSetWeightChange = (e) => {
        const newSetWeight = e.target.value;
        // setSetWeight(newSetWeight);
        onUpdate(setId, { weight: newSetWeight });
        handleUpdateSet({ weight: newSetWeight });
    }

    return (
        <div className="flex justify-between w-full text-center items-center my-2">
            <div className="w-1/4">
                <p>{setCount}</p>
            </div>

            <div className="w-1/4 px-2 md:px-3">
                <input
                    type="text"
                    value={reps}
                    className="w-full text-center bg-gray-900 h-10 rounded-sm"
                    onChange={handleSetRepChange}
                />
            </div>

            <div className="w-1/4 px-2 md:px-3">
                <input
                    type="text"
                    value={weight}
                    className="w-full text-center bg-gray-900 h-10 rounded-sm"
                    onChange={handleSetWeightChange}
                />
            </div>

            <div className="w-1/4 px-2 md:px-3">
                <button onClick={onDelete} className="w-full flex justify-center items-center cursor-pointer text-sm rounded-sm h-10 border border-red-400 text-red-400">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-4">
                        <path fillRule="evenodd" d="M5 3.25V4H2.75a.75.75 0 0 0 0 1.5h.3l.815 8.15A1.5 1.5 0 0 0 5.357 15h5.285a1.5 1.5 0 0 0 1.493-1.35l.815-8.15h.3a.75.75 0 0 0 0-1.5H11v-.75A2.25 2.25 0 0 0 8.75 1h-1.5A2.25 2.25 0 0 0 5 3.25Zm2.25-.75a.75.75 0 0 0-.75.75V4h3v-.75a.75.75 0 0 0-.75-.75h-1.5ZM6.05 6a.75.75 0 0 1 .787.713l.275 5.5a.75.75 0 0 1-1.498.075l-.275-5.5A.75.75 0 0 1 6.05 6Zm3.9 0a.75.75 0 0 1 .712.787l-.275 5.5a.75.75 0 0 1-1.498-.075l.275-5.5a.75.75 0 0 1 .786-.711Z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>

        </div>
    )
}