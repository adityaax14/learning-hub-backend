import mongoose from "mongoose";

const lessonProgressSchema=new mongoose.Schema({
  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
  },
  course:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Course"
    
  },
  completedLessons:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Lesson"
  }],
  inProgressLesson:{
     type:mongoose.Schema.Types.ObjectId,
    ref:"Lesson"
  },
  lastAccessedAt: {
      type: Date,
      default: Date.now
    }
  
  

},{ timestamps: true });

export const LessonProgress =
  mongoose.model("LessonProgress", lessonProgressSchema);