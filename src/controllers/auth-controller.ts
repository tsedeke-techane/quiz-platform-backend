import type { Request, Response } from "express"
import bcrypt from "bcryptjs"
import { z } from "zod"
import { prisma } from "../index.js"
import type { AuthRequest } from "../middleware/auth.js"
import { generateToken } from "../utils/jwt.js"

const SignupSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
  password: z.string().min(6),
})

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

export const signup = async (req: any, res: Response) => {
  try {
    const { email, name, password } = SignupSchema.parse(req.body)

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    })

    const token = generateToken(user.id)

    res.json({
      user: { id: user.id, email: user.email, name: user.name },
      token,
    })
  } catch (error: any) {
    if (error.name === "ZodError") {
      return res.status(400).json({ error: "Validation error", details: error.errors })
    }
    res.status(400).json({ error: "Signup failed" })
  }
}

export const login = async (req: any, res: Response) => {
  try {
    const { email, password } = LoginSchema.parse(req.body)

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password" })
    }

    const token = generateToken(user.id)

    res.json({
      user: { id: user.id, email: user.email, name: user.name },
      token,
    })
  } catch (error: any) {
    if (error.name === "ZodError") {
      return res.status(400).json({ error: "Validation error", details: error.errors })
    }
    res.status(400).json({ error: "Login failed" })
  }
}

export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req as AuthRequest
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true },
    })

    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    res.json(user)
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user" })
  }
}
