import mongoose from "mongoose";

const lessonTimeSchema= new mongoose.Schema({
  lesson:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Lesson",
    required:true
  },
  timeSpent:{
    type:Number,
    default:0
  },
  lastUpdated:{
    type:Date,
    default:Date.now()
  }
  
},{_id:false})

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
  lessonTime:[lessonTimeSchema],
  isCourseCompleted:{
       type:Boolean,
       default:false
  },
  completedAt:{
    type:Date
  },
  lastAccessedAt: {
      type: Date,
      default: Date.now
    }
  
  

},{ timestamps: true });

export const LessonProgress =
  mongoose.model("LessonProgress", lessonProgressSchema);