import mongoose from "mongoose";

const WorkoutSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    date: { type: Date, required: true },
    notes: { type: String, default: "" }
}, { timestamps: true });

const Workout = mongoose.models.Workout || mongoose.model("Workout", WorkoutSchema);

export default Workout;