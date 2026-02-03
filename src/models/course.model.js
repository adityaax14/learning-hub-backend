import mongoose from "mongoose";

const courseSchema=new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true
    },
    level:{
      type:String,
      enum:["beginner","intermediate","advanced"],
      default:"beginner"
    },
    creator:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"User",
      required:true
    },
    lessons:[{
      type:mongoose.Schema.Types.ObjectId,
      ref:"Lesson",
      
    }
  ]

  },
  {timestamps:true}
);

export const Course= mongoose.model("Course",courseSchema);