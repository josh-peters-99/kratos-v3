import mongoose from "mongoose";

const ExerciseSchema = new mongoose.Schema({
    workout: { type: mongoose.Schema.Types.ObjectId, ref: "Workout", required: true },
    name: { type: String, default: "" },
    type: { type: String, required: true },
});

const Exercise = mongoose.models.Exercise || mongoose.model("Exercise", ExerciseSchema);

export default Exercise;