"use client"

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { fetchWorkouts, createWorkout, updateWorkout, deleteWorkout } from "@/lib/api/workouts";
import { fetchExercises, createExercise, updateExercise, deleteExercise, deleteExercisesByWorkout } from "@/lib/api/exercises";
import { fetchSets, createSet, updateSet, deleteSet, deleteSetsByWorkout } from "@/lib/api/sets";
import Options from "@/components/ui/Options";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

export default function Workout() {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [maxDate, setMaxDate] = useState("");
    const [workoutDate, setWorkoutDate] = useState("");
    const [workout, setWorkout] = useState(null);
    const [notes, setNotes] = useState("");
    const [exercises, setExercises] = useState([]);
    const [sets, setSets] = useState([]);
    const [typingTimeout, setTypingTimeout] = useState(null);
    const [mounted, setMounted] = useState(false);
    const [showOptions, setShowOptions] = useState(false);
    const triggerRef = useRef(null); // Reference for closing the dropdown when clicking outside
    const [showConfirmDiscard, setShowConfirmDiscard] = useState(false);

    // Ensure component is mounted before trying to create a new workout. Prevents the creation of two workouts on page load
    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        setMaxDate(today.toISOString().split("T")[0]);

        async function loadOrCreateWorkout() {
            let storedWorkoutId = sessionStorage.getItem("tempWorkoutId");

            if (storedWorkoutId) {
                const workouts = await fetchWorkouts();
                const existingWorkout = workouts.find(w => w._id === storedWorkoutId);

                // Fetch existing exercises with matching workout ID's from DB
                const exercises = await fetchExercises(storedWorkoutId);
                if (exercises.length != 0) {
                    // console.log(exercises);
                    setExercises(exercises);
                }
                
                // Fetch existing sets with matching workout ID's from DB
                const sets = await fetchSets(storedWorkoutId);
                if (sets.length != 0) {
                    console.log(sets);
                    setSets(sets);
                }
                
                // Fetch existing workouts with matching workout ID's from DB
                if (existingWorkout) {
                    setWorkout(existingWorkout);
                    setTitle(existingWorkout.title);
                    setWorkoutDate(existingWorkout.date);
                    setNotes(existingWorkout.notes);
                    return;
                } else {
                    sessionStorage.removeItem("tempWorkoutId"); // Cleanup if workout is missing
                }
            }

            // No stored workout, create a new one
            const newWorkout = await createWorkout({ title: "New Workout", date: new Date(), notes: "" });
            setWorkout(newWorkout);
            setTitle(newWorkout.title);
            setWorkoutDate(newWorkout.date);
            setNotes(newWorkout.notes);
            sessionStorage.setItem("tempWorkoutId", newWorkout._id);

            // Create a new exercise when a new workout is created
            const newExercise = await createExercise({ workout: newWorkout._id, name: "" });
            setExercises([...exercises, newExercise]);

            // Create a new set when a new exercise is created
            const newSet = await createSet({ workout: newWorkout._id, exercise: newExercise._id, count: 1, reps: 0, weight: 0 });
            setSets([...sets, newSet]);
        }

        loadOrCreateWorkout();
    }, [mounted]);

    useEffect(() => {
        if (workout) {
            if (typingTimeout) clearTimeout(typingTimeout);

            const timeout = setTimeout(async () => {
                await updateWorkout(workout._id, { title, date: workoutDate, notes });
            }, 500); // 500ms debounce

            setTypingTimeout(timeout);
        }
    }, [title, workoutDate, notes]);

    useEffect(() => {
        const timeoutIds = exercises.map((exercise, index) => {
            if (!exercise._id) return null; // Skip if no valid exercise ID
    
            return setTimeout(async () => {
                await updateExercise(exercise._id, { name: exercise.name });
            }, 500); // 500ms debounce time
        });
    
        return () => timeoutIds.forEach((id) => id && clearTimeout(id));
    }, [exercises]);

    useEffect(() => {
        const timeoutIds = sets.map((set, index) => {
            if (!set._id) return null;

            return setTimeout(async () => {
                await updateSet(set._id, { count: set.count, reps: set.reps, weight: set.weight });
            }, 500);
        });

        return () => timeoutIds.forEach((id) => id && clearTimeout(id));
    }, [sets]);
    

    function handleResetWorkout() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        setTitle("New Workout");
        setWorkoutDate(today.toISOString().split("T")[0]);
        setNotes("");
    }

    async function handleDiscardWorkout() {
        if (workout) {
            await deleteWorkout(workout._id);

            // Delete exercises associated with workout
            await deleteExercisesByWorkout(workout._id);

            // Delete sets associated with workout
            await deleteSetsByWorkout(workout._id);
        }
        sessionStorage.removeItem("tempWorkoutId"); // Clear session storage
        router.push("/");
    }

    async function handleAddExercise() {
        if (!workout) return;
        const newExercise = await createExercise({ workout: workout._id, name: "" });
        const newSet = await createSet({ workout: workout._id, exercise: newExercise._id, count: 1, reps: 0, weight: 0 });
        setExercises(prev => [...prev, newExercise]);
        setSets(prev => [...prev, newSet]);
    }

    async function handleAddSet(exerciseId) {
        if (!workout || !exerciseId) return;
        const newSet = await createSet({ 
            workout: workout._id,
            exercise: exerciseId,
            count: sets.filter(set => set.exercise === exerciseId).length + 1,
            reps: 0,
            weight: 0
         });

         setSets(prev => [...prev, newSet]);
    }

    async function handleDiscardSet(setId, exerciseId) {
        if (workout) {
            await deleteSet(setId);
            setSets(prev => {
                // Filter out the set to be discarded
                const updatedSets = prev.filter(set => set._id !== setId);
                let count = 1;

                return updatedSets.map(set => {
                    if (set.exercise === exerciseId) {
                        return {
                            ...set,
                            count: count++
                        };
                    }
                    return set;
                })
            });
        }
    }

    async function handleSubmit(event) {
        event.preventDefault();
        sessionStorage.removeItem("tempWorkoutId");
        router.push("/");
    }

    return (
        <section className="px-10 mt-8 w-full flex flex-col justify-center items-center">
            <div className="flex w-full justify-between items-center md:w-[500px]">
                <h1 className="font-bold text-3xl">Log Workout</h1>
                <button ref={triggerRef} onClick={() => setShowOptions((prev) => !prev)} className="bg-background text-white pr-0 cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                    </svg>
                </button>


            </div>
            <form className="w-full flex flex-col gap-5 mt-5 md:w-[500px]" onSubmit={handleSubmit}>
                <div>
                    <label>Workout Title</label>
                    <input 
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="workoutDate">Date</label>
                    <input 
                        type="date"
                        id="workoutDate"
                        max={maxDate}
                        value={workoutDate ? new Date(workoutDate).toISOString().split("T")[0] : ""}
                        onChange={(e) => setWorkoutDate(e.target.value)}
                        required
                    />
                </div>
                {exercises.map((exercise, index) => (
                    <div key={exercise._id} className="bg-gray-700 p-3">
                        <label>Exercise Name</label>
                        <div>
                            <input 
                                type="text"
                                value={exercise.name || ""}
                                onChange={(e) => {
                                    const updatedName = e.target.value;
                                    const updateExercises = [...exercises];
                                    updateExercises[index].name = updatedName;
                                    setExercises(updateExercises);
                                }}
                            />
                            {/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
                            </svg>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                            </svg> */}
                        </div>

                        <div className="flex w-full justify-between">
                            <p>Set</p>
                            <p>Reps</p>
                            <p>Weight</p>
                            <p>Delete</p>
                        </div>
                        {sets
                            .filter(set => set.exercise === exercise._id)
                            .map((set, setIndex) => (
                                <div key={setIndex} className="flex w-full justify-evenly gap-8">
                                    <label>{set.count}</label>
                                    <input
                                        className="text-center"
                                        type="text"
                                        value={set.reps || ""}
                                        onChange={(e) => {
                                            const updatedSets = sets.map(s =>
                                                s._id === set._id ? {...s, reps: e.target.value } : s
                                            );
                                            setSets(updatedSets)
                                        }}
                                    />
                                    <input 
                                        className="text-center"
                                        type="text"
                                        value={set.weight || ""}
                                        onChange={(e) => {
                                            const updatedSets = sets.map(s =>
                                                s._id === set._id ? {...s, weight: e.target.value } : s
                                            );
                                            setSets(updatedSets)
                                        }}
                                    />
                                    <button type="button" className="flex items-center" onClick={() => handleDiscardSet(set._id, exercise._id)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                        </svg>
                                    </button>
                                </div>
                        ))}
                        <div className="flex w-full justify-center pt-5">
                            <button 
                                type="button"
                                className="bg-black p-3 rounded-md"
                                onClick={() => handleAddSet(exercise._id)}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                </svg>
                            </button>
                        </div>
                    </div>
                ))}
                <div className="flex flex-col">
                    <label>Notes</label>
                    <textarea
                        id="notes"
                        rows={4}
                        value={notes}
                        className="bg-white text-black px-3 py-2 rounded-md"
                        onChange={(e) => setNotes(e.target.value)}
                    ></textarea>
                </div>
            </form>

            {/* Reusable Bottom Sheet Component */}
            <Options
                isOpen={showOptions}
                onClose={() => setShowOptions((prev) => !prev)}
                title="Options"
                triggerRef={triggerRef}
            >
                <button className="w-full text-left flex bg-background items-center text-white px-0 cursor-pointer" onClick={handleResetWorkout}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 mr-2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7 48.678 48.678 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 0 0 3.7 3.7 48.656 48.656 0 0 0 7.324 0 4.006 4.006 0 0 0 3.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3-3 3" />
                    </svg>
                    Reset Workout
                </button>
                <button className="w-full text-left flex bg-background items-center text-white px-0 cursor-pointer" onClick={handleAddExercise}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 mr-2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                    Add Exercise
                </button>
                <button className="w-full text-left flex bg-background items-center text-white px-0 cursor-pointer" onClick={() => setShowConfirmDiscard(true)}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 mr-2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                    Discard Workout
                </button>
                <button onClick={handleSubmit} className="w-full text-left flex bg-background items-center text-white px-0 cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 mr-2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m.75 12 3 3m0 0 3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                    </svg>
                    Finish Workout
                </button>
            </Options>

            {/* Centered Confirmation Dialog */}
            <ConfirmDialog 
                isOpen={showConfirmDiscard}
                onClose={() => setShowConfirmDiscard(false)}
                onConfirm={handleDiscardWorkout}
                title="Confirm Discard"
                message="Are you sure you want to discard this workout? This action cannot be undone."
                confirmText="Discard"
                cancelText="Cancel"
            />
        </section>
    )
}