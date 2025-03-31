"use client"

import { useEffect, useState } from "react";
import ExerciseDropdown from "./ExerciseDropdown";
import { fetchExercises } from "@/lib/api/exercises";
import { useRouter } from "next/navigation";

export default function WorkoutCard({ workoutId, workoutTitle, workoutDate }) {
    const router = useRouter();
    const [exercises, setExercises] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expanded, setExpanded] = useState(false);

    useEffect(() => {
        async function loadExercises() {
            try {
                const data = await fetchExercises(workoutId);
                setExercises(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }

        loadExercises();
    }, []);

    if (loading) return <p>Loading exercises...</p>
    if (error) return <p>Error: {error}</p>

    const visibleExercises = expanded ? exercises : exercises.slice(0, 3);

    async function handleEditWorkout() {
        router.push(`/edit-workout/${workoutId}`)
      }

    return (
        <div className="w-full px-5 py-3 mb-8 bg-gray-800 rounded-md">
            <div className="flex justify-between w-full">
                <div className="flex items-center">
                    <h2 className="text-xl mr-1">{workoutTitle}</h2>
                    <span className="text-gray-500 mr-1">•</span>
                    <p className="italic text-sm text-gray-500">{new Date(workoutDate).toLocaleDateString()}</p>
                </div>
                <button onClick={() => handleEditWorkout()} className="cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4">
                        <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32L19.513 8.2Z" />
                    </svg>
                </button>
            </div>
            {exercises.length === 0 ? (
                <p>No exercises found.</p>
            ) : (
                <div>
                    {visibleExercises.map((exercise, index) => (
                        <div key={index}>
                            <ExerciseDropdown exerciseId={exercise._id} exerciseName={exercise.name} />
                        </div>
                    ))}
                </div>
            )}

            {exercises.length > 3 && (
                <div className="flex w-full justify-center">
                    <button
                        onClick={() => setExpanded(!expanded)}
                        className="mt-3 text-blue-400 hover:underline"
                    >
                        {expanded ? "View Less" : "View More"}
                    </button>
                </div>
            )}
        </div>
    )
}