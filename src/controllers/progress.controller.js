import { LessonProgress } from "../models/lessonProgress.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Course } from "../models/course.model.js";
const ensureLessonTimeEntry = (progress, lessonId) => {
  const existing = progress.lessonTime.find(
    (l) => l.lesson.toString() === lessonId.toString()
  );

  if (!existing) {
    progress.lessonTime.push({
      lesson: lessonId,
      timeSpent: 0
    });
  }
};


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
    progress.completedLessons = progress.completedLessons.filter(
    (id) => id.toString() !== lessonId
  );

  progress.inProgressLesson = lessonId;
  progress.lastAccessedAt = new Date();
  progress.isCourseCompleted=false;

  ensureLessonTimeEntry(progress, lessonId);

  await progress.save();

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

      const course= await Course.findById(courseId).select("lessons");
      const totalLessons=course.lessons.length;
      const completedCount= progress.completedLessons.length;

      if(completedCount=== totalLessons && totalLessons >0){
        progress.isCourseCompleted=true;
        progress.completedAt=new Date();
      }

      await progress.save();

      return res.status(200).json(
    new ApiResponse(200, progress, "Lesson completed")
  );

});

export const updateLessonTime= asyncHandler(async(req,res)=>{
   const {courseId,lessonId}=req.params;
   const {seconds}=req.body;
   const userId=req.user._id;
   
   if (!seconds || seconds<=0){
    throw new ApiError(400,"Invalid time update");

   }
   const progress= await LessonProgress.findOne({
    user:userId,
    course:courseId
   });
   if(!progress){
    throw new ApiError(404,"Progress not found");
   }
   const lessonEntry= progress.lessonTime.find(
    (l)=>l.lesson.toString()=== lessonId
   );
    if (!seconds || seconds <= 0) {
    throw new ApiError(400, "Invalid time update");
  }
  lessonEntry.timeSpent+=seconds;
  lessonEntry.lastUpdated= new Date();
  const lesson = await LessonProgress.findById(lessonId);
  const requiredTime= lesson.duration*60*0.8;
  if(lessonEntry.timeSpent>=requiredTime && !progress.completedLessons.includes(lessonId)){
     progress.completedLessons.push(lessonId);
     progress.inProgressLesson=null;

  }
  progress.lastAccessedAt= new Date();
  await progress.save();
  return res.status(200).json(new ApiResponse(200, lessonEntry,"Time updated"));
});