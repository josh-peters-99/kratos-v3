export async function fetchSets(workoutId) {
    const res = await fetch(`/api/sets?workout=${workoutId}`);
    if (!res.ok) throw new Error("Failed to fetch sets");
    return res.json();
}
  
export async function createSet(data) {
    const res = await fetch("/api/sets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    console.log('Set CREATED!!')
    return res.json();
}
  
export async function updateSet(id, data) {
    const res = await fetch(`/api/sets/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
}
  
export async function deleteSet(id) {
    return fetch(`/api/sets/${id}`, { method: "DELETE" });
}

export async function deleteSetsByWorkout(workoutId) {
  const res = await fetch(`/api/sets?workout=${workoutId}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete exercises");
  return res.json();
}