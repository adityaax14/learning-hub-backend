import mongoose from "mongoose";
import { Course } from "../models/course.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { LessonProgress } from "../models/lessonProgress.model.js";


export const getCourseAnalytics= asyncHandler(async(req,res)=>{
   const {courseId}= req.params;
   const userId=req.user._id;

   const progress = await LessonProgress.findOne({
    course:courseId,
    user:userId
    
   });

   if (!progress) {
    throw new ApiError(404, "Progress not found");
  }
  const course= await Course.findById(courseId);
  if (!course) {
    throw new ApiError(404, "Course not found");
  }
  const totalLessons=course.lessons.length;
  const completedLessonsCount = progress.completedLessons.length;

  
  const progressPercent =
    totalLessons === 0
      ? 0
      : Math.round((completedLessonsCount / totalLessons) * 100);
     const totalTimeSpent= progress.lessonTime.reduce((sum,entry)=>sum+entry.timeSpent,0);

     const activeDays = new Set(
    progress.lessonTime.map(entry =>
      entry.lastUpdated.toISOString().slice(0, 10)
    )
  );

  const learningStreak = activeDays.size;

  
  const lastActive = progress.updatedAt;

  
  return res.status(200).json(
    new ApiResponse(200, {
      progressPercent,
      completedLessons: completedLessonsCount,
      totalLessons,
      totalTimeSpent,
      learningStreak,
      lastActive,
      inProgressLesson: progress.inProgressLesson,
      courseCompleted: progress.isCourseCompleted
    })
  );
})