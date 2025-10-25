import express from "express"
import { getAllQuizzes, getQuizById, getQuizzesByDifficulty } from "../controllers/quiz-controller.js"

const router = express.Router()

router.get("/", getAllQuizzes)
router.get("/difficulty", getQuizzesByDifficulty)
router.get("/:id", getQuizById)

export default router
