"use client"

import { useParams, useRouter } from "next/navigation";
import { fetchWorkout, updateWorkout, deleteWorkout } from "@/lib/api/workouts";
import { fetchExercises, createExercise, deleteExercisesByWorkout } from "@/lib/api/exercises";
import { deleteSetsByWorkout } from "@/lib/api/sets";
import { useEffect, useState, useCallback } from "react";
import ExerciseCard from "@/components/ui/workout/ExerciseCard";

export default function EditWorkout() {
    const { id } = useParams(); // Get the dynamic ID from URL
    const router = useRouter();
    const [workout, setWorkout] = useState(null);
    const [maxDate, setMaxDate] = useState("");
    const [exercises, setExercises] = useState([]);

    useEffect(() => {
        if (!id) return; // Prevent fetching if id is undefined

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        setMaxDate(today.toISOString().split("T")[0]);

        async function loadWorkout() {
            try {
                const workoutData = await fetchWorkout(id);
                setWorkout(workoutData);
            } catch (error) {
                console.error("Failed to fetch workout:", error);
            }
        }

        async function loadExercises() {
            try {
                const exercises = await fetchExercises(id);
                setExercises(exercises);
            } catch (error) {
                console.error("Failed to fetch exercises:", error);
            }
        }

        loadWorkout();
        loadExercises();
    }, [id]);

    // Debounce function to delay API calls (prevents too many requests)
    const debounce = (func, delay) => {
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => func(...args), delay);
        };
    };

    // Function to update the workout in the database
    const handleUpdateWorkout = useCallback(
        debounce(async (updatedFields) => {
            try {
                await updateWorkout(id, updatedFields);
                console.log("Workout updated:", updatedFields);
            } catch (error) {
                console.error("Failed to update workout:", error);
            }
        }, 500), // Wait 500ms before sending update
        [id]
    );

    // Handle title change
    const handleTitleChange = (e) => {
        const newTitle = e.target.value;
        setWorkout((prev) => ({ ...prev, title: newTitle }));
        handleUpdateWorkout({ title: newTitle });
    };

    // Handle date change
    const handleDateChange = (e) => {
        const newDate = e.target.value;
        setWorkout((prev) => ({ ...prev, date: newDate }));
        handleUpdateWorkout({ date: newDate });
    };

    // Handle note change
    const handleNoteChange = (e) => {
        const newNote = e.target.value;
        setWorkout((prev) => ({ ...prev, notes: newNote }));
        handleUpdateWorkout({ notes: newNote })
    }

    const handleAddExercise = async () => {
        try {
            const newExercise = await createExercise({ workout: workout._id, name: "New Exercise" }); // Replace with appropriate default values
            setExercises((prevExercises) => [...prevExercises, newExercise]);
        } catch (error) {
            console.error("Failed to create exercise:", error);
        }
    }

    const handleDiscardWorkout = async () => {
        try {
            await deleteWorkout(workout._id);
            await deleteExercisesByWorkout(workout._id);
            await deleteSetsByWorkout(workout._id);
            router.push("/");
        } catch (error) {
            console.error("Failed to discard workout:", error);
        }
    }

    const handleSaveWorkout = async () => {
        router.push("/");
    }

    return (
        <section className="flex flex-col w-full items-center px-3 mb-30">
            {workout ? (
                <div className="w-full md:w-[500px]">
                    <div className="border-b pb-10 mb-10 border-gray-800">
                        <h1>Workout Details</h1>
                        <div className="bg-gray-800 rounded-md p-3 mt-1">
                            <div>
                                <label htmlFor="title" className="text-sm">Name:</label>
                                <input 
                                    type="text"
                                    id="title"
                                    value={workout.title}
                                    onChange={handleTitleChange}
                                    className="mt-1 bg-gray-900 w-full h-12 rounded-sm"
                                />
                            </div>
                            <div className="mt-3">
                                <label htmlFor="date" className="text-sm">Date:</label>
                                <input 
                                    type="date"
                                    id="date"
                                    value={workout.date ? new Date(workout.date).toISOString().split("T")[0] : ""}
                                    onChange={handleDateChange}
                                    max={maxDate}
                                    className="mt-1 bg-gray-900 w-full h-12 rounded-sm"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pb-2 border-b border-gray-800">
                        <h1>Exercises</h1>
                        {exercises.map((exercise, index) => (
                            <div key={index}>
                                <ExerciseCard workoutId={workout._id} exerciseName={exercise.name} exerciseId={exercise._id} />
                            </div>
                        ))}
                        <div className="flex w-full justify-center mb-8">
                            <button onClick={handleAddExercise} className="border px-3 py-2 rounded-sm cursor-pointer hover:bg-white hover:text-black">
                                Add Exercise
                            </button>
                        </div>
                    </div>

                    <div className="mt-10 flex flex-col pb-10">
                        <label>Notes</label>
                        <div className="p-3 bg-gray-800 rounded-md">
                            <textarea
                                id="notes"
                                rows={4}
                                value={workout.notes}
                                className="bg-gray-900 px-3 py-2 rounded-md w-full text-white"
                                onChange={handleNoteChange}
                            ></textarea>
                        </div>
                    </div>

                    <div className="flex justify-evenly">
                        <button onClick={handleDiscardWorkout} className="px-3 py-2 cursor-pointer bg-red-400 rounded-sm">
                            Discard Workout
                        </button>
                        <button onClick={handleSaveWorkout} className="px-3 py-2 cursor-pointer bg-blue-400 rounded-sm">
                            Save Workout
                        </button>
                    </div>
                </div>
            ) : (
                <p>Loading workout...</p>
            )}
        </section>
    )
}