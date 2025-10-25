import type { Request, Response, NextFunction } from "express"
import { verifyToken } from "../utils/jwt.js"

export interface AuthRequest extends Request {
  userId: string
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization || req.headers["x-access-token"] as string | undefined

  if (!authHeader) {
    return res.status(401).json({ error: "Authorization token missing" })
  }

  const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader

  const payload = verifyToken(token)

  if (!payload || !payload.userId) {
    return res.status(401).json({ error: "Invalid or expired token" })
  }

  ;(req as AuthRequest).userId = payload.userId
  next()
}
