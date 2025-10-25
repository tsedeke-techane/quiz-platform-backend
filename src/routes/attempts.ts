import express from "express"
import { startAttempt, submitAttempt, getUserQuizAttempts, getQuizAttemptById } from "../controllers/quiz-attempt-controller.js"
import { authMiddleware } from "../middleware/auth.js"

const router = express.Router()

// Start an attempt (creates a QuizAttempt and returns randomized questions)
router.post("/start", authMiddleware, startAttempt)

// Submit an attempt (grade and save answers)
router.post("/:id/submit", authMiddleware, submitAttempt)

// Get current user's attempts (history)
router.get("/user", authMiddleware, getUserQuizAttempts)

// Get a specific attempt by id (must be owned by the user)
router.get("/:id", authMiddleware, getQuizAttemptById)

export default router
