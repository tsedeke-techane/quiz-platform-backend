import type { Response, Request } from "express"
import { prisma } from "../index.js"

export const getAllQuizzes = async (req: Request, res: Response) => {
  try {
    const quizzes = await prisma.quiz.findMany({
      include: {
        questions: true,
      },
    })

    const formattedQuizzes = quizzes.map((quiz) => ({
      id: quiz.id,
      title: quiz.title,
      description: quiz.description,
      difficulty: quiz.difficulty,
      timeLimit: quiz.timeLimit,
      questions: quiz.questions.map((q) => ({
        id: q.id,
        question: q.question,
        options: JSON.parse(q.options),
        correctAnswer: q.correctAnswer,
      })),
    }))

    res.json(formattedQuizzes)
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch quizzes" })
  }
}

export const getQuizById = async (req: Request, res: Response) => {
  try {
    const quiz = await prisma.quiz.findUnique({
      where: { id: req.params.id },
      include: {
        questions: true,
      },
    })

    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" })
    }

    const formattedQuiz = {
      id: quiz.id,
      title: quiz.title,
      description: quiz.description,
      difficulty: quiz.difficulty,
      timeLimit: quiz.timeLimit,
      questions: quiz.questions.map((q) => ({
        id: q.id,
        question: q.question,
        options: JSON.parse(q.options),
        correctAnswer: q.correctAnswer,
      })),
    }

    res.json(formattedQuiz)
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch quiz" })
  }
}

export const getQuizzesByDifficulty = async (req: Request, res: Response) => {
  try {
    const { difficulty } = req.query

    const quizzes = await prisma.quiz.findMany({
      where: {
        difficulty: difficulty as string,
      },
      include: {
        questions: true,
      },
    })

    const formattedQuizzes = quizzes.map((quiz) => ({
      id: quiz.id,
      title: quiz.title,
      description: quiz.description,
      difficulty: quiz.difficulty,
      timeLimit: quiz.timeLimit,
      questions: quiz.questions.map((q) => ({
        id: q.id,
        question: q.question,
        options: JSON.parse(q.options),
        correctAnswer: q.correctAnswer,
      })),
    }))

    res.json(formattedQuizzes)
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch quizzes" })
  }
}
