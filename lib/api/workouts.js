export async function fetchWorkout(id) {
  const res = await fetch(`/api/workouts?workout=${id}`);
  if (!res.ok) throw new Error("Failed to fetch workout");
  return res.json();
}

export async function fetchWorkouts() {
    const res = await fetch("/api/workouts");
    if (!res.ok) throw new Error("Failed to fetch workouts");
    return res.json();
  }
    
  export async function createWorkout(data) {
    const res = await fetch("/api/workouts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  }
    
  export async function updateWorkout(id, data) {
    const res = await fetch(`/api/workouts/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  }
    
  export async function deleteWorkout(id) {
    return fetch(`/api/workouts/${id}`, { method: "DELETE" });
  }