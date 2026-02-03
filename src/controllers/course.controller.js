
import mongoose from "mongoose";
import { Course } from "../models/course.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { LessonProgress } from "../models/lessonProgress.model.js";

export const createCourse= asyncHandler(async(req,res)=>{
  const {title,description,category,level}=req.body;
  if(!title || !description || !category){
    throw new ApiError(400,"All fields are required")
  }
   const course=await Course.create({
    title,
    description,
    category,
    level,
    creator: req.user._id
   })
   return res.status(201).json(new ApiResponse(201,course,"Course created successfully"));
});

export const getAllCourses= asyncHandler(async(req,res)=>{
   const courses= await Course.find().populate("creator","username").sort({createdAt:-1});
   return res.status(201).json(new ApiResponse(200,courses,"Courses fetched successfully"));
});

export const getCourseById=asyncHandler(async(req,res)=>{
  const {courseId}=req.params;
  if (!mongoose.isValidObjectId(courseId)) {
    throw new ApiError(400, "Invalid course ID");
  }

  const course=await Course.findById(courseId).populate("creator" ,"username email").populate("lessons");
  if(!course){
    throw new ApiError(404, "Course not found");
  }
  return res.status(200).json( new ApiResponse(200,course,"course fetched succesfully"));
})

export const getCourseProgress=asyncHandler(async(req,res)=>{
    const {courseId}=req.params;
    const userId=req.user._id;
    const progress= await LessonProgress.findOne({
      course:courseId,
      user:userId
    });
     return res.json(
    new ApiResponse(200, progress || null)
  );
})


