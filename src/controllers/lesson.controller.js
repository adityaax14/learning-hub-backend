import { Lesson } from "../models/lessons.model.js";
import { Course } from "../models/course.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const addLessonToCourse = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const { title, description, videoUrl, duration } = req.body;

  if (!title || !videoUrl) {
    throw new ApiError(400, "Title and video URL are required");
  }

  const course = await Course.findById(courseId);
  if (!course) {
    throw new ApiError(404, "Course not found");
  }

  if (!req.user) {
    throw new ApiError(401, "Unauthorized");
  }

  if (course.creator.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Only creator can add lessons");
  }

  const lesson = await Lesson.create({
    title,
    description,
    videoUrl,
    duration,
    course: courseId
  });

  course.lessons.push(lesson._id);
  await course.save();

  return res.status(201).json(
    new ApiResponse(201, lesson, "Lesson added successfully")
  );
});

export const getLessonById= asyncHandler(async(req,res)=>{
   const {courseId,lessonId}=req.params;
   const lesson=await Lesson.findById(lessonId);
    if (!lesson) {
    throw new ApiError(404, "Lesson not found");
  }

  return res.status(200).json(
    new ApiResponse(200, lesson, "Lesson fetched successfully")
  );
})