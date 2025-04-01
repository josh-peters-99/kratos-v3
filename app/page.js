"use client"

import { fetchWorkouts } from "@/lib/api/workouts";
import WorkoutCard from "@/components/ui/home-feed/WorkoutCard";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { createWorkout } from "@/lib/api/workouts";

export default function Home() {
  const { data: session } = useSession();
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    async function loadWorkouts() {
      try {
        const data = await fetchWorkouts();

        // Sort workouts by newest to oldest
        const sortedWorkouts = data.sort((a, b) => new Date(b.date) - new Date(a.date));

        setWorkouts(sortedWorkouts);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    loadWorkouts();
  }, []);


  const handleCreateWorkout = async () => {
    try {
      const newWorkout = await createWorkout({ title: "New Workout", date: new Date(), notes: "" });
      router.push(`/workouts/${newWorkout._id}`);
    } catch (error) {
      console.error("Failed to create workout:", error);
    }
  }

  if (loading) return <p>Loading workouts...</p>;
  if (error) return <p>Error: {error}</p>

  // Get user's name
  const userName = session?.user?.username || "User";
  const firstName = session?.user?.firstname || "User";

  return (
    <section className="flex flex-col w-full items-center mb-30">
      <h1 className="text-3xl p-3">{firstName}'s Workouts</h1>
      {workouts.length === 0 ? (
        <div>
          <p>No workouts found.</p>
          <button onClick={handleCreateWorkout} className="border px-3 py-2 rounded-sm cursor-pointer mt-3 hover:bg-white hover:text-black">
            Create Workout
          </button>
        </div>
      ) : (
        <div className="px-3 md:w-[500px] w-full">
          {workouts.map((workout, index) => (
            <div key={index}>
              <WorkoutCard workoutId={workout._id} workoutTitle={workout.title} workoutDate={workout.date} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
