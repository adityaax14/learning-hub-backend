import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { completeLesson, getLearningTimeline, updateLessonTime } from "../controllers/progress.controller.js";
import { getCourseAnalytics,getCreatorAnalytics } from "../controllers/analytics.contoller.js";

const router=Router();
router.post("/:courseId/:lessonId/time",verifyJWT,updateLessonTime)
//router.get("/progress/:courseId/status",verifyJWT,completeLesson)
router.get("/progress/:courseId/analytics",verifyJWT,getCourseAnalytics)
router.get("/progress/:courseId/timeline",verifyJWT,getLearningTimeline);
router.get("/progress/creator/:courseId/analytics",verifyJWT,getCreatorAnalytics);


export default router;