"use client"

import { fetchWorkouts } from "@/lib/api/workouts";
import WorkoutCard from "@/components/ui/home-feed/WorkoutCard";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) return <p>Loading workouts...</p>;
  if (error) return <p>Error: {error}</p>

  // Get user's name
  const userName = session?.user?.username || "User";

  return (
    <section className="flex flex-col w-full items-center mb-30">
      <h1 className="text-3xl p-3">{userName}'s Workouts</h1>
      {workouts.length === 0 ? (
        <p>No workouts found.</p>
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
