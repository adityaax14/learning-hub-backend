import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { completeLesson, updateLessonTime } from "../controllers/progress.controller.js";
import { getCourseAnalytics } from "../controllers/analytics.contoller.js";

const router=Router();
router.post("/:courseId/:lessonId/time",verifyJWT,updateLessonTime)
//router.get("/progress/:courseId/status",verifyJWT,completeLesson)
router.get("/progress/:courseId/analytics",verifyJWT,getCourseAnalytics)


export default router;