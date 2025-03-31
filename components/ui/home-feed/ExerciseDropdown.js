"use client"

import { useEffect, useState } from "react";
import { fetchSetsByExercise } from "@/lib/api/sets";
import SetDisplay from "./SetDisplay";

export default function ExerciseDropdown({ exerciseId, exerciseName }) {
    const [exerciseOpen, setExerciseOpen] = useState(false);
    const [sets, setSets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function loadSets() {
            try {
                const data = await fetchSetsByExercise(exerciseId);
                setSets(data);
            } catch(error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }

        loadSets();
    }, [])

    if (loading) return <p>Loading sets...</p>
    if (error) return <p>Error: {error}</p>

    return (
        <div>
            <div className="flex w-full justify-between py-3 px-3 my-2 bg-gray-700 rounded-md">
                <h3>{exerciseName}</h3>
                <button onClick={() => setExerciseOpen(!exerciseOpen)} className="cursor-pointer">
                    {exerciseOpen ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
                        </svg>               
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                        </svg>
                    )}
                </button>
            </div>

            {exerciseOpen && (
                <div>
                    {sets.length === 0 ? (
                        <p>No sets found.</p>
                    ) : (
                        <div>
                            <div className="flex justify-between text-center">
                                <h4 className="w-1/3">Set</h4>
                                <h4 className="w-1/3">Reps</h4>
                                <h4 className="w-1/3">Weight</h4>
                            </div>
                            {sets.map((set, index) => (
                                <div key={index} className="flex justify-between text-center py-1">
                                    <SetDisplay count={set.count} reps={set.reps} weight={set.weight} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}