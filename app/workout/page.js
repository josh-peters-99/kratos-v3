"use client"

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { fetchWorkouts, createWorkout, updateWorkout, deleteWorkout } from "@/lib/api/workouts";
import Options from "@/components/ui/Options";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

export default function Workout() {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [maxDate, setMaxDate] = useState("");
    const [workoutDate, setWorkoutDate] = useState("");
    const [workout, setWorkout] = useState(null);
    const [notes, setNotes] = useState("");
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
        }
        sessionStorage.removeItem("tempWorkoutId"); // Clear session storage
        router.push("/");
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
                <button ref={triggerRef} onClick={() => setShowOptions((prev) => !prev)} className="bg-background text-white pr-0">
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
                <div className="flex flex-col">
                    <label>Notes</label>
                    <textarea
                        id="notes"
                        rows={4}
                        value={notes}
                        className="text-black px-3 py-2 rounded-md"
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
                <button className="w-full text-left flex bg-background items-center text-white px-0" onClick={handleResetWorkout}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 mr-2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7 48.678 48.678 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 0 0 3.7 3.7 48.656 48.656 0 0 0 7.324 0 4.006 4.006 0 0 0 3.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3-3 3" />
                    </svg>
                    Reset Workout
                </button>
                <button className="w-full text-left flex bg-background items-center text-white px-0" onClick={() => setShowConfirmDiscard(true)}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 mr-2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                    Discard Workout
                </button>
                <button onClick={handleSubmit} className="w-full text-left flex bg-background items-center text-white px-0">
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