import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    description: String,
    videoUrl: {
      type: String,
      required: true
    },
    duration: Number,
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true
    }
  },
  { timestamps: true }
);

export const Lesson = mongoose.model("Lesson", lessonSchema);
