import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  // Clear existing data
  await prisma.quizAttempt.deleteMany()
  await prisma.question.deleteMany()
  await prisma.quiz.deleteMany()

  // Create quizzes with questions
  const basicAlgebra = await prisma.quiz.create({
    data: {
      title: "Basic Algebra",
      description: "Test your knowledge of fundamental algebraic concepts",
      difficulty: "Beginner",
      timeLimit: 300,
      questions: {
        create: [
          {
            question: "Solve for x: 2x + 5 = 13",
            options: JSON.stringify(["x = 4", "x = 9", "x = 3", "x = 6"]),
            correctAnswer: "x = 4",
          },
          {
            question: "What is the value of 3x - 7 when x = 5?",
            options: JSON.stringify(["8", "15", "22", "10"]),
            correctAnswer: "8",
          },
          {
            question: "Simplify: 2(x + 3) - 4",
            options: JSON.stringify(["2x + 2", "2x + 6", "2x - 4", "x + 2"]),
            correctAnswer: "2x + 2",
          },
          {
            question: "If 4x = 20, what is x?",
            options: JSON.stringify(["4", "5", "6", "8"]),
            correctAnswer: "5",
          },
          {
            question: "Solve: x/2 = 6",
            options: JSON.stringify(["3", "12", "8", "4"]),
            correctAnswer: "12",
          },
        ],
      },
    },
  })

  const fractionsDecimals = await prisma.quiz.create({
    data: {
      title: "Fractions & Decimals",
      description: "Master fractions, decimals, and their conversions",
      difficulty: "Intermediate",
      timeLimit: 300,
      questions: {
        create: [
          {
            question: "Convert 3/4 to a decimal",
            options: JSON.stringify(["0.5", "0.75", "0.25", "0.85"]),
            correctAnswer: "0.75",
          },
          {
            question: "What is 1/2 + 1/4?",
            options: JSON.stringify(["1/6", "3/4", "1/8", "2/3"]),
            correctAnswer: "3/4",
          },
          {
            question: "Convert 0.5 to a fraction",
            options: JSON.stringify(["1/4", "1/2", "1/3", "2/5"]),
            correctAnswer: "1/2",
          },
          {
            question: "What is 2/3 × 3/4?",
            options: JSON.stringify(["1/2", "6/12", "5/12", "1/4"]),
            correctAnswer: "1/2",
          },
          {
            question: "Divide: 3/4 ÷ 1/2",
            options: JSON.stringify(["3/8", "3/2", "1/2", "2/3"]),
            correctAnswer: "3/2",
          },
        ],
      },
    },
  })

  const calculusBasics = await prisma.quiz.create({
    data: {
      title: "Calculus Basics",
      description: "Explore derivatives, integrals, and limits",
      difficulty: "Advanced",
      timeLimit: 300,
      questions: {
        create: [
          {
            question: "What is the derivative of x²?",
            options: JSON.stringify(["x", "2x", "x³", "2"]),
            correctAnswer: "2x",
          },
          {
            question: "Find the derivative of 3x³ + 2x",
            options: JSON.stringify(["9x² + 2", "3x² + 2", "9x + 2", "6x + 2"]),
            correctAnswer: "9x² + 2",
          },
          {
            question: "What is the integral of 2x?",
            options: JSON.stringify(["x²", "x² + C", "2", "x + C"]),
            correctAnswer: "x² + C",
          },
          {
            question: "Find the limit as x approaches 2 of (x² + 1)",
            options: JSON.stringify(["3", "4", "5", "6"]),
            correctAnswer: "5",
          },
          {
            question: "What is the derivative of sin(x)?",
            options: JSON.stringify(["cos(x)", "-cos(x)", "sin(x)", "tan(x)"]),
            correctAnswer: "cos(x)",
          },
        ],
      },
    },
  })

  console.log("Seed data created successfully")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
