![License](https://img.shields.io/badge/License-MIT-yellow.svg)
# 🧠 QuizArena

A full-stack gamified MCQ quiz platform. Users browse topics, take timed quizzes, and track their progress. Admins manage the full question bank through a dedicated panel.

## Tech Stack

**Frontend:** React 18, Vite, React Router v7, Styled Components, Axios
**Backend:** Node.js, Express, PostgreSQL, JWT auth (access + httpOnly refresh tokens), Zod, bcrypt

## Features

- Auth with auto-refreshing JWT sessions — no random logouts mid-quiz
- Browse topics → chapters → take a timed quiz with instant feedback
- Dashboard with real stats (quizzes taken, avg score, streak, recent activity)
- Admin panel for full CRUD on Topics → Chapters → Questions → Options
- Role-based route protection, error boundaries, responsive dark UI

## Getting Started

### Backend
```bash
cd backend
npm install
# create .env — see Environment Variables below
node migrations/migrate.js
npm run dev
```

### Frontend
```bash
cd frontend
npm install
# create .env — see Environment Variables below
npm run dev
```

Backend runs on `:5000`, frontend on `:5173`.

## Environment Variables

**backend/.env**
```env
PORT=5000
NODE_ENV=development
DATABASE_URL=postgres://user:password@host:port/dbname
JWT_ACCESS_SECRET=replace_with_a_long_random_string
JWT_REFRESH_SECRET=replace_with_a_different_long_random_string
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d
CORS_ORIGIN=http://localhost:5173
BCRYPT_ROUNDS=12
```

**frontend/.env**
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## Making a User an Admin

Register normally, then run:
```sql
UPDATE users SET role = 'admin' WHERE email = 'you@example.com';
```

## License

MIT
