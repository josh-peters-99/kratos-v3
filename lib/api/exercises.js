export async function fetchExercises(workoutId) {
    const res = await fetch(`/api/exercises?workout=${workoutId}`);
    if (!res.ok) throw new Error("Failed to fetch exercises");
    return res.json();
}
  
export async function createExercise(data) {
    const res = await fetch("/api/exercises", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    console.log('Exercise CREATED!!!')
    return res.json();
}
  
export async function updateExercise(id, data) {
    const res = await fetch(`/api/exercises/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
}
  
export async function deleteExercise(id) {
    return fetch(`/api/exercises/${id}`, { method: "DELETE" });
}

export async function deleteExercisesByWorkout(workoutId) {
  const res = await fetch(`/api/exercises?workoutId=${workoutId}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete exercises");
  return res.json();
}