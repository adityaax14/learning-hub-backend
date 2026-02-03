import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app=express()

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(cookieParser())
app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true}))
app.use(express.static("public"))



import userRouter from './routes/user.routes.js'
import courseRouter from "./routes/course.routes.js"
import lessonRouter from "./routes/lessons.routes.js"



app.use("/api/v2/users",userRouter)
app.use("/api/v2/courses",courseRouter)
app.use("/api/v2/lessons",lessonRouter)


export {app}