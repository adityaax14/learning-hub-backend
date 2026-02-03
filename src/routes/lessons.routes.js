import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addLessonToCourse } from "../controllers/lesson.controller.js";

const router =Router();

//router.post("/course/:courseId",verifyJWT,addLessonToCourse);

export default router;