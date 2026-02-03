import { LessonProgress } from "../models/lessonProgress.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const startLesson=asyncHandler(async(req,res)=>{
    const {courseId,lessonId}=req.params;
    const userId=req.user._id;

    let progress=await LessonProgress.findOne({
      user: userId,
      course: courseId
    });
    if(!progress){
     await LessonProgress.create({
         user:userId,
         course:courseId,
         inProgressLesson:lessonId,
         lastAccessedAt: new Date()
      });
    }
    else {
    progress.inProgressLesson = lessonId;

    progress.lastAccessedAt = new Date();
    await progress.save();
  }

  return res.status(200).json(
    new ApiResponse(200, progress, "Lesson started")
  );
});

export const completeLesson= asyncHandler(async(req,res)=>{
    const { courseId, lessonId } = req.params;
    const userId = req.user._id;

    const progress= await LessonProgress.findOne({
      user:userId,
      course:courseId
    });
    if(!progress){
      throw new ApiError(404,"No progress found");
    }
    if(progress?.completedLessons?.includes(lessonId)){
       return res.status(200).json(
    new ApiResponse(200, progress, "Lesson completed")
  );
    }
    if(!progress.completedLessons.includes(lessonId)){
      progress.completedLessons.push(lessonId);
     
    }
    if (progress.inProgressLesson?.toString() === lessonId) {
    progress.inProgressLesson = null;
  }
     progress.lastAccessedAt=new Date();
      await progress.save();

      return res.status(200).json(
    new ApiResponse(200, progress, "Lesson completed")
  );

});

