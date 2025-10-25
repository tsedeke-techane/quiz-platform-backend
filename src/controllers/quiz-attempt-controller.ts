import type { Request, Response } from "express"
import type { Prisma } from "@prisma/client"
import { z } from "zod"
import { prisma } from "../index.js"
import type { AuthRequest } from "../middleware/auth.js"

const QuizAttemptSchema = z.object({
  quizId: z.string(),
  score: z.number(),
  totalQuestions: z.number(),
  timeSpent: z.number(),
  answers: z.record(z.any()),
})

export const createQuizAttempt = async (req: Request, res: Response) => {
  try {
    const { quizId, score, totalQuestions, timeSpent, answers, questions } = QuizAttemptSchema.extend({
      questions: z.array(z.any()),
    }).parse(req.body)

    const { userId } = req as AuthRequest

    const quiz = await prisma.quiz.findUnique({ where: { id: quizId } })
    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" })
    }

    const attempt = await prisma.quizAttempt.create({
      data: {
        userId,
        quizId,
        score,
        totalQuestions,
        timeSpent,
        answers: JSON.stringify(answers),
        questionAnswers: {
          create: questions.map((q: any, index: number) => ({
            questionId: q.id,
            selectedAnswerIndex: answers[index],
            selectedAnswer: q.options[answers[index]],
            correctAnswer: q.correctAnswer,
            isCorrect: q.options[answers[index]] === q.correctAnswer,
          })),
        },
      },
      include: {
        questionAnswers: true,
      },
    })

    res.status(201).json({
      id: attempt.id,
      score: attempt.score,
      totalQuestions: attempt.totalQuestions,
      timeSpent: attempt.timeSpent,
      createdAt: attempt.createdAt,
    })
  } catch (error: any) {
    if (error.name === "ZodError") {
      return res.status(400).json({ error: "Validation error", details: error.errors })
    }
    res.status(400).json({ error: "Failed to create quiz attempt" })
  }
}

// Start an attempt: create a QuizAttempt row and return randomized questions (without correct answers)
export const startAttempt = async (req: Request, res: Response) => {
  try {
    const { quizId } = z.object({ quizId: z.string() }).parse(req.body)
    const { userId } = req as AuthRequest

    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: { questions: true },
    })

    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" })
    }

    // Shuffle questions
    const questions = [...quiz.questions]
    for (let i = questions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[questions[i], questions[j]] = [questions[j], questions[i]]
    }

    // Create an attempt record (not yet graded)
    const attempt = await prisma.quizAttempt.create({
      data: {
        userId,
        quizId: quiz.id,
        score: 0,
        totalQuestions: questions.length,
        timeSpent: 0,
        answers: JSON.stringify([]),
      },
    })

    const sanitizedQuestions = questions.map((q) => ({
      id: q.id,
      question: q.question,
      options: JSON.parse(q.options),
    }))

    res.json({ attemptId: attempt.id, timeLimit: quiz.timeLimit, questions: sanitizedQuestions })
  } catch (error: any) {
    res.status(400).json({ error: "Failed to start attempt" })
  }
}

// Submit an attempt: grade, save question answers and update the attempt
export const submitAttempt = async (req: Request, res: Response) => {
  try {
    const attemptId = req.params.id
    const body = z.object({ answers: z.array(z.object({ questionId: z.string(), selectedAnswerIndex: z.number() })), timeSpent: z.number().optional() }).parse(req.body)
    const { userId } = req as AuthRequest

    const attempt = await prisma.quizAttempt.findUnique({ where: { id: attemptId }, include: { quiz: { include: { questions: true } } } })
    if (!attempt) return res.status(404).json({ error: "Attempt not found" })
    if (attempt.userId !== userId) return res.status(403).json({ error: "Unauthorized" })

    const answers = body.answers

    // Build questionAnswers and compute score
    let score = 0
    const qAnswersData = answers.map((ans) => {
      const q = attempt.quiz.questions.find((qq: any) => qq.id === ans.questionId)
      const options = q ? JSON.parse(q.options) : []
      const selected = options[ans.selectedAnswerIndex]
      const isCorrect = q ? selected === q.correctAnswer : false
      if (isCorrect) score += 1
      return {
        questionId: ans.questionId,
        selectedAnswerIndex: ans.selectedAnswerIndex,
        selectedAnswer: selected || "",
        correctAnswer: q ? q.correctAnswer : "",
        isCorrect,
      }
    })

    // Update attempt
    const updatedAttempt = await prisma.quizAttempt.update({
      where: { id: attemptId },
      data: {
        score,
        timeSpent: body.timeSpent ?? attempt.timeSpent,
        answers: JSON.stringify(answers),
        questionAnswers: { create: qAnswersData },
      },
      include: { questionAnswers: true, quiz: true },
    })

    res.json({ id: updatedAttempt.id, score: updatedAttempt.score, totalQuestions: updatedAttempt.totalQuestions })
  } catch (error: any) {
    res.status(400).json({ error: "Failed to submit attempt" })
  }
}

export const getUserQuizAttempts = async (req: Request, res: Response) => {
  try {
    const { userId } = req as AuthRequest
    // Only include attempts that have answers submitted (i.e., at least one QuestionAnswer)
    const attempts = await prisma.quizAttempt.findMany({
      where: { userId, questionAnswers: { some: {} } },
      include: { quiz: true },
      orderBy: { createdAt: "desc" },
    })

    const formattedAttempts = attempts.map((attempt: any) => ({
      id: attempt.id,
      quizTitle: attempt.quiz.title,
      quizId: attempt.quizId,
      score: attempt.score,
      totalQuestions: attempt.totalQuestions,
      percentage: Math.round((attempt.score / attempt.totalQuestions) * 100),
      timeSpent: attempt.timeSpent,
      createdAt: attempt.createdAt,
    }))

    res.json(formattedAttempts)
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch quiz attempts" })
  }
}

export const getQuizAttemptById = async (req: Request, res: Response) => {
  try {
    const { userId } = req as AuthRequest
    const attempt = await prisma.quizAttempt.findUnique({
      where: { id: req.params.id },
      include: {
        quiz: true,
        questionAnswers: {
          include: {
            question: true,
          },
        },
      },
    })

    if (!attempt) {
      return res.status(404).json({ error: "Quiz attempt not found" })
    }

    if (attempt.userId !== userId) {
      return res.status(403).json({ error: "Unauthorized" })
    }

    res.json({
      id: attempt.id,
      quizTitle: attempt.quiz.title,
      score: attempt.score,
      totalQuestions: attempt.totalQuestions,
      percentage: Math.round((attempt.score / attempt.totalQuestions) * 100),
      timeSpent: attempt.timeSpent,
      answers: JSON.parse(attempt.answers),
      questionAnswers: attempt.questionAnswers.map((qa: any) => ({
        questionId: qa.questionId,
        questionText: qa.question.question,
        selectedAnswer: qa.selectedAnswer,
        correctAnswer: qa.correctAnswer,
        isCorrect: qa.isCorrect,
      })),
      createdAt: attempt.createdAt,
    })
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch quiz attempt" })
  }
}

export const getQuizAttemptStats = async (req: Request, res: Response) => {
  try {
    const { userId } = req as AuthRequest
    // Stats should reflect only submitted attempts
    const attempts = await prisma.quizAttempt.findMany({
      where: { userId, questionAnswers: { some: {} } },
    })

    const totalAttempts = attempts.length
    const averageScore =
      attempts.length > 0 ? Math.round(attempts.reduce((sum: number, a: any) => sum + a.score, 0) / attempts.length) : 0
    const totalTimeSpent = attempts.reduce((sum: number, a: any) => sum + a.timeSpent, 0)
    const bestScore = attempts.length > 0 ? Math.max(...attempts.map((a: any) => a.score)) : 0

    res.json({
      totalAttempts,
      averageScore,
      totalTimeSpent,
      bestScore,
    })
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch stats" })
  }
}
