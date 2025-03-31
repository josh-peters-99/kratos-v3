"use client"

import { updateExercise } from "@/lib/api/exercises";
import { useCallback, useState, useEffect } from "react";
import { deleteExercise } from "@/lib/api/exercises";
import { fetchSetsByExercise, createSet, deleteSet, updateSet } from "@/lib/api/sets";
import SetRow from "./SetRow";

export default function ExerciseCard({ workoutId, exerciseName, exerciseId }) {
    const [name, setName] = useState(exerciseName);
    const [sets, setSets] = useState([]);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    useEffect(() => {
        if (!exerciseId) return;

        async function loadSets() {
            try {
                const fetchedSets = await fetchSetsByExercise(exerciseId);
                setSets(fetchedSets);
            } catch (error) {
                console.error("Failed to fetch sets:", error);
            }
        }

        loadSets();
    }, [exerciseId]);

    useEffect(() => {
        sets.forEach(async (set) => {
            await updateSet(set._id, { count: set.count, reps: set.reps, weight: set.weight });
        });
        console.log("Updated sets:", sets);
    }, [sets]); // Re-runs when `sets` changes
    

    const debounce = (func, delay) => {
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => func(...args), delay);
        };
    };

    const handleUpdateExercise = useCallback(
        debounce(async (updatedFields) => {
            try {
                await updateExercise(exerciseId, updatedFields);
                console.log("Exercise updated:", updatedFields);
            } catch (error) {
                console.error("Failed to update exercise:", error);
            }
        }, 500),
        [exerciseId]
    )

    const handleExerciseNameChange = (e) => {
        const newExerciseName = e.target.value;
        setName(newExerciseName);
        handleUpdateExercise({ name: newExerciseName });
    }

    const handleAddSet = async () => {
        try {
            const newSet = await createSet({ workout: workoutId, exercise: exerciseId, count: sets.length + 1, reps: 0, weight: 0 });
            setSets((prevSets) => [...prevSets, newSet]); // Add new set to state
        } catch (error) {
            console.error("Failed to add set:", error);
        }
    }

    const handleDeleteSet = async (setId) => {
        try {
            await deleteSet(setId);

            setSets((prevSets) => {
                return prevSets
                    .filter(set => set._id !== setId)
                    .map((set, index) => ({
                        ...set,
                        count: index + 1, // Update set count
                    }));
            });
        } catch (error) {
            console.error("Failed to delete set:", error);
        }
    }

    const handleUpdateSetInState = (setId, updatedFields) => {
        setSets((prevSets) => 
            prevSets.map((set) =>
                set._id === setId ? { ...set, ...updatedFields } : set
            )
        );
    };

    const handleDeleteExercise = async () => {
        await deleteExercise(exerciseId);
    }

    return (
        <div className="mb-8">
            <div>
                <div className="bg-gray-800 rounded-md p-3 mt-1">
                    <div>
                        <div className="w-full flex justify-between items-center">
                            <label htmlFor="exerciseName" className="text-sm">Exercise Name:</label>
                            <button onClick={handleDeleteExercise} className="text-sm text-red-400 cursor-pointer">
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

                    {dropdownOpen ? (
                        <div className="mt-4">
                            <div className="flex justify-between text-center w-full">
                                <h3 className="w-1/4 text-sm">Set</h3>
                                <h3 className="w-1/4 text-sm">Reps</h3>
                                <h3 className="w-1/4 text-sm">Weight</h3>
                                <h3 className="w-1/4 text-sm">Delete</h3>
                            </div>
                            <div className="mt-1">
                                {sets.map((set, index) => (
                                    <div key={index}>
                                        <SetRow setId={set._id} count={set.count} reps={set.reps} weight={set.weight} onDelete={() => handleDeleteSet(set._id)} onUpdate={handleUpdateSetInState} />
                                    </div>
                                ))}
                            </div>
                            <div className="flex w-full justify-center mt-5">
                                <button onClick={handleAddSet} className="rounded-sm px-3 py-2 flex items-center border cursor-pointer text-sm">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-4 mr-1">
                                        <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
                                    </svg>
                                    <p>Add Set</p>
                                </button>
                            </div>
                        </div>
                    ) : (
                        <span></span>
                    )}

                </div>
            </div>
        </div>
    )
}