import type { Request, Response, NextFunction } from "express"

export interface ApiError extends Error {
  status?: number
  details?: any
}

export const errorHandler = (err: ApiError, req: Request, res: Response, next: NextFunction) => {
  console.error("[Error]", err.message, err.stack)

  if (err.name === "ZodError") {
    return res.status(400).json({
      error: "Validation error",
      details: err.details,
    })
  }

  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      error: "Invalid token",
    })
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      error: "Token expired",
    })
  }

  const status = err.status || 500
  const message = err.message || "Internal server error"

  res.status(status).json({
    error: message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  })
}
