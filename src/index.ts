import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import authRoutes from "./routes/auth.js"
import quizRoutes from "./routes/quiz.js"
import quizAttemptRoutes from "./routes/quiz-attempt.js"
import attemptsRoutes from "./routes/attempts.js"
import { errorHandler } from "./middleware/error-handler.js"
import { requestLogger } from "./middleware/request-logger.js"
import pkg from "@prisma/client"
const { PrismaClient } = pkg

dotenv.config()

const app = express()
const prisma = new PrismaClient()
const PORT = process.env.PORT || 5000

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
  if (reason instanceof Error) console.error(reason.stack);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  if (error instanceof Error) console.error(error.stack);
});

// Middleware
const FRONTEND_ORIGIN = process.env.FRONTEND_URL || "http://localhost:3000"
app.use(
  cors({
    origin: FRONTEND_ORIGIN,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
)
app.use(express.json())
app.use(requestLogger)

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/quizzes", quizRoutes)
app.use("/api/quiz-attempts", quizAttemptRoutes)
app.use("/api/attempts", attemptsRoutes)

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" })
})

// Error handling
app.use(errorHandler)

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

export { prisma }
