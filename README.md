# Quiz Platform Backend

Express.js backend for the Quiz Platform with TypeScript, PostgreSQL and Prisma ORM.

## Setup

1. Install dependencies:
\`\`\`bash
npm install
\`\`\`

2. Set up environment variables:
\`\`\`bash
cp .env.example .env
\`\`\`

3. Generate Prisma client:
\`\`\`bash
npm run prisma:generate
\`\`\`

4. Run migrations:
\`\`\`bash
npm run prisma:migrate
\`\`\`

5. Seed the database:
\`\`\`bash
npm run prisma:seed
\`\`\`

6. Start the development server:
\`\`\`bash
npm run dev
\`\`\`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)

### Quizzes
- `GET /api/quizzes` - Get all quizzes
- `GET /api/quizzes/:id` - Get quiz by ID
- `GET /api/quizzes/difficulty?difficulty=Beginner` - Get quizzes by difficulty

### Quiz Attempts
- `POST /api/quiz-attempts` - Create quiz attempt (requires auth)
- `GET /api/quiz-attempts` - Get user's quiz attempts (requires auth)
- `GET /api/quiz-attempts/:id` - Get specific quiz attempt (requires auth)
- `GET /api/quiz-attempts/stats` - Get user statistics (requires auth)

## Environment Variables

\`\`\`
DATABASE_URL=file:./dev.db
JWT_SECRET=your-secret-key-change-this-in-production
PORT=5000
NODE_ENV=development
\`\`\`

## Project Structure

\`\`\`
backend/
├── src/
│   ├── controllers/     # Business logic
│   ├── routes/         # API routes
│   ├── middleware/     # Express middleware
│   ├── utils/          # Utility functions
│   └── index.ts        # Server entry point
├── prisma/
│   ├── schema.prisma   # Database schema
│   └── seed.ts         # Database seeding
├── package.json
├── tsconfig.json
└── .env
