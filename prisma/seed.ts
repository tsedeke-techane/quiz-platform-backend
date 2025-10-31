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
            question: "Solve for $x$: $2x + 5 = 13$",
            options: JSON.stringify(["$x = 4$", "$x = 9$", "$x = 3$", "$x = 6$"]),
            correctAnswer: "$x = 4$",
          },
          {
            question: "What is the value of $3x - 7$ when $x = 5$?",
            options: JSON.stringify(["$8$", "$15$", "$22$", "$10$"]),
            correctAnswer: "$8$",
          },
          {
            question: "Simplify: $2(x + 3) - 4$",
            options: JSON.stringify(["$2x + 2$", "$2x + 6$", "$2x - 4$", "$x + 2$"]),
            correctAnswer: "$2x + 2$",
          },
          {
            question: "If $4x = 20$, what is $x$?",
            options: JSON.stringify(["$4$", "$5$", "$6$", "$8$"]),
            correctAnswer: "$5$",
          },
          {
            question: "Solve: $\\frac{x}{2} = 6$",
            options: JSON.stringify(["$3$", "$12$", "$8$", "$4$"]),
            correctAnswer: "$12$",
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
            question: "Convert $\\frac{3}{4}$ to a decimal",
            options: JSON.stringify(["$0.5$", "$0.75$", "$0.25$", "$0.85$"]),
            correctAnswer: "$0.75$",
          },
          {
            question: "What is $\\frac{1}{2} + \\frac{1}{4}$?",
            options: JSON.stringify(["$\\frac{1}{6}$", "$\\frac{3}{4}$", "$\\frac{1}{8}$", "$\\frac{2}{3}$"]),
            correctAnswer: "$\\frac{3}{4}$",
          },
          {
            question: "Convert $0.5$ to a fraction",
            options: JSON.stringify(["$\\frac{1}{4}$", "$\\frac{1}{2}$", "$\\frac{1}{3}$", "$\\frac{2}{5}$"]),
            correctAnswer: "$\\frac{1}{2}$",
          },
          {
            question: "What is $\\frac{2}{3} \\times \\frac{3}{4}$?",
            options: JSON.stringify(["$\\frac{1}{2}$", "$\\frac{6}{12}$", "$\\frac{5}{12}$", "$\\frac{1}{4}$"]),
            correctAnswer: "$\\frac{1}{2}$",
          },
          {
            question: "Divide: $\\frac{3}{4} \\div \\frac{1}{2}$",
            options: JSON.stringify(["$\\frac{3}{8}$", "$\\frac{3}{2}$", "$\\frac{1}{2}$", "$\\frac{2}{3}$"]),
            correctAnswer: "$\\frac{3}{2}$",
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
            question: "What is the derivative of $x^2$?",
            options: JSON.stringify(["$x$", "$2x$", "$x^3$", "$2$"]),
            correctAnswer: "$2x$",
          },
          {
            question: "Find the derivative of $3x^3 + 2x$",
            options: JSON.stringify(["$9x^2 + 2$", "$3x^2 + 2$", "$9x + 2$", "$6x + 2$"]),
            correctAnswer: "$9x^2 + 2$",
          },
          {
            question: "What is $\\int 2x\\,\\d x$?",
            options: JSON.stringify(["$x^2$", "$x^2 + C$", "$2$", "$x + C$"]),
            correctAnswer: "$x^2 + C$",
          },
          {
            question: "Find $\\lim_{x \\to 2} (x^2 + 1)$",
            options: JSON.stringify(["$3$", "$4$", "$5$", "$6$"]),
            correctAnswer: "$5$",
          },
          {
            question: "What is $\\frac{\\d}{\\d x}\\sin(x)$?",
            options: JSON.stringify(["$\\cos(x)$", "$-\\cos(x)$", "$\\sin(x)$", "$\\tan(x)$"]),
            correctAnswer: "$\\cos(x)$",
          },
        ],
      },
    },
  })

  const geometry = await prisma.quiz.create({
    data: {
      title: "Geometry Fundamentals",
      description: "Test your knowledge of geometric shapes, angles, and area calculations",
      difficulty: "Intermediate",
      timeLimit: 300,
      questions: {
        create: [
          {
            question: "What is the area of a circle with radius $r = 5$ units?",
            options: JSON.stringify(["$25\\pi$ square units", "$10\\pi$ square units", "$20\\pi$ square units", "$15\\pi$ square units"]),
            correctAnswer: "$25\\pi$ square units",
          },
          {
            question: "In a right triangle, if one angle is $30\\degree$ and the hypotenuse is $10$ units, what is the length of the shortest side?",
            options: JSON.stringify(["$5$ units", "$5\\sqrt{3}$ units", "$5\\sqrt{2}$ units", "$10\\sqrt{3}$ units"]),
            correctAnswer: "$5$ units",
          },
          {
            question: "What is the sum of interior angles of a regular pentagon?",
            options: JSON.stringify(["$360\\degree$", "$480\\degree$", "$540\\degree$", "$720\\degree$"]),
            correctAnswer: "$540\\degree$",
          },
          {
            question: "If a rectangle has length $\\ell = 8$ units and width $w = 6$ units, what is its perimeter?",
            options: JSON.stringify(["$24$ units", "$28$ units", "$48$ units", "$32$ units"]),
            correctAnswer: "$28$ units",
          },
          {
            question: "What is the volume of a sphere with radius $r = 3$ units?",
            options: JSON.stringify(["$36\\pi$ cubic units", "$\\frac{36\\pi}{3}$ cubic units", "$\\frac{108\\pi}{3}$ cubic units", "$36$ cubic units"]),
            correctAnswer: "$\\frac{36\\pi}{3}$ cubic units",
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



// import { PrismaClient } from "@prisma/client"

// const prisma = new PrismaClient()

// async function main() {
//   await prisma.quizAttempt.deleteMany()
//   await prisma.question.deleteMany()
//   await prisma.quiz.deleteMany()

//   const stressTestQuiz = await prisma.quiz.create({
//     data: {
//       title: "MathRenderer Stress Test",
//       description: "Edge-case math expressions to test dynamic rendering",
//       difficulty: "Advanced",
//       timeLimit: 600,
//       questions: {
//         create: [
//           // Fractions and decimals
//           {
//             question: "Evaluate $\\frac{7}{9} + \\frac{2}{3}$",
//             options: JSON.stringify(["$1$", "$13/9$", "$11/9$", "$3/2$"]),
//             correctAnswer: "$13/9$",
//           },
//           {
//             question: "Convert $0.333\\dots$ to fraction",
//             options: JSON.stringify(["$1/3$", "$1/2$", "$2/3$", "$3/4$"]),
//             correctAnswer: "$1/3$",
//           },

//           // Nested fractions
//           {
//             question: "Simplify $\\frac{1 + \\frac{1}{2}}{\\frac{3}{4}}$",
//             options: JSON.stringify(["$2$", "$5/3$", "$3/2$", "$7/4$"]),
//             correctAnswer: "$2$",
//           },

//           // Powers & roots
//           {
//             question: "Evaluate $\\sqrt{16} + 2^3$",
//             options: JSON.stringify(["$12$", "$8$", "$16$", "$10$"]),
//             correctAnswer: "$12$",
//           },
//           {
//             question: "Simplify $x^{2^3}$ when $x=2$",
//             options: JSON.stringify(["$256$", "$64$", "$16$", "$8$"]),
//             correctAnswer: "$256$",
//           },

//           // Calculus
//           {
//             question: "Compute $\\frac{d}{dx} (x^2 \\cdot \\sin(x))$",
//             options: JSON.stringify([
//               "$2x \\sin(x) + x^2 \\cos(x)$",
//               "$x^2 \\cos(x)$",
//               "$2x \\cos(x)$",
//               "$x \\sin(x)$"
//             ]),
//             correctAnswer: "$2x \\sin(x) + x^2 \\cos(x)$",
//           },
//           {
//             question: "Evaluate $\\int_0^1 3x^2 dx$",
//             options: JSON.stringify(["$1$", "$1 + C$", "$0$", "$3$"]),
//             correctAnswer: "$1$",
//           },

//           // Limits
//           {
//             question: "Find $\\lim_{x\\to0} \\frac{\\sin(x)}{x}$",
//             options: JSON.stringify(["$1$", "$0$", "$\\infty$", "$-1$"]),
//             correctAnswer: "$1$",
//           },

//           // Complex nested expressions
//           {
//             question: "Simplify $\\frac{2}{3} \\div \\frac{4}{5} + \\sqrt{9}$",
//             options: JSON.stringify(["$5/6 + 3$", "$3/2 + 3$", "$5/6$", "$3/2$"]),
//             correctAnswer: "$5/6 + 3$",
//           },
//           {
//             question: "Evaluate $\\frac{1}{1 + \\frac{1}{1 + 1}}$",
//             options: JSON.stringify(["$3/2$", "$2/3$", "$1/2$", "$1$"]),
//             correctAnswer: "$3/2$",
//           },

//           // Plain math-like text (to test convertPlainMath)
//           {
//             question: "Solve 2x + 5 = 13",
//             options: JSON.stringify(["$x = 4$", "$x = 3$", "$x = 5$", "$x = 6$"]),
//             correctAnswer: "$x = 4$",
//           },
//           {
//             question: "Calculate sqrt(16) + 2^3",
//             options: JSON.stringify(["$12$", "$8$", "$10$", "$16$"]),
//             correctAnswer: "$12$",
//           },
//         ],
//       },
//     },
//   })

//   console.log("Stress-test seed created successfully")
// }

// main()
//   .catch((e) => {
//     console.error(e)
//     process.exit(1)
//   })
//   .finally(async () => {
//     await prisma.$disconnect()
//   })
