export async function fetchSets(exerciseId) {
    const res = await fetch(`/api/sets?exercise=${exerciseId}`);
    if (!res.ok) throw new Error("Failed to fetch sets");
    return res.json();
}
  
export async function createSet(data) {
    const res = await fetch("/api/sets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
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