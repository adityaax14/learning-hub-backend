import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createCourse,getAllCourses ,getCourseById,getCourseProgress} from "../controllers/course.controller.js";
import { addLessonToCourse,getLessonById} from "../controllers/lesson.controller.js";
import { startLesson } from "../controllers/progress.controller.js";
import { completeLesson, } from "../controllers/progress.controller.js";


const router=Router();

router.post("/",verifyJWT,createCourse);
router.get("/",verifyJWT,getAllCourses);
router.get("/:courseId",getCourseById);
router.post(
  "/:courseId/lessons",
  verifyJWT,
  addLessonToCourse
);
router.get("/:courseId/lessons/:lessonId",verifyJWT,getLessonById);
router.post( "/:courseId/lessons/:lessonId/start",verifyJWT,startLesson);
router.post( "/:courseId/lessons/:lessonId/complete",verifyJWT,completeLesson);
router.get("/:courseId/progress",verifyJWT,getCourseProgress);



export default router;