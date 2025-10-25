import express from "express"
import {
  createQuizAttempt,
  getUserQuizAttempts,
  getQuizAttemptById,
  getQuizAttemptStats,
} from "../controllers/quiz-attempt-controller.js"
import { authMiddleware } from "../middleware/auth.js"

const router = express.Router()

router.post("/", authMiddleware, createQuizAttempt)
router.get("/", authMiddleware, getUserQuizAttempts)
router.get("/stats", authMiddleware, getQuizAttemptStats)
router.get("/:id", authMiddleware, getQuizAttemptById)

export default router
