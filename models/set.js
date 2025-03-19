import mongoose from "mongoose";

const SetSchema = new mongoose.Schema({
    workout: { type: mongoose.Schema.Types.ObjectId, ref: "Workout", required: true },
    exercise: { type: mongoose.Schema.Types.ObjectId, ref: "Exercise", required: true },
    count: { type: Number, required: true },
    reps: { type: Number, required: true },
    weight: { type: Number, required: true }
});

const Set = mongoose.models.Set || mongoose.model("Set", SetSchema);

export default Set;