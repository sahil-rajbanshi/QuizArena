import 'dotenv/config';
import { query } from '../src/config/db.js';

const migrations = [
  // Users table
  `
  CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR NOT NULL,
    email VARCHAR UNIQUE NOT NULL,
    password_hash VARCHAR NOT NULL,
    role VARCHAR DEFAULT 'user',
    created_at TIMESTAMPTZ DEFAULT now()
  )
  `,

  // Topics table
  `
  CREATE TABLE IF NOT EXISTS topics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR NOT NULL,
    slug VARCHAR UNIQUE NOT NULL,
    description TEXT,
    icon VARCHAR,
    display_order INT,
    created_at TIMESTAMPTZ DEFAULT now()
  )
  `,

  // Chapters table
  `
  CREATE TABLE IF NOT EXISTS chapters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    topic_id UUID REFERENCES topics(id) ON DELETE CASCADE,
    name VARCHAR NOT NULL,
    slug VARCHAR NOT NULL,
    description TEXT,
    display_order INT,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(topic_id, slug)
  )
  `,

  // Questions table
  `
  CREATE TABLE IF NOT EXISTS questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chapter_id UUID REFERENCES chapters(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    difficulty VARCHAR DEFAULT 'medium',
    explanation TEXT,
    display_order INT,
    created_at TIMESTAMPTZ DEFAULT now()
  )
  `,

  // Options table
  `
  CREATE TABLE IF NOT EXISTS options (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
    option_text TEXT NOT NULL,
    is_correct BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
  )
  `,

  // Progress table
  `
  CREATE TABLE IF NOT EXISTS progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
    selected_option_id UUID REFERENCES options(id) ON DELETE SET NULL,
    is_correct BOOLEAN,
    attempted_at TIMESTAMPTZ DEFAULT now()
  )
  `,

  // Quiz sessions table
  `
  CREATE TABLE IF NOT EXISTS quiz_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    chapter_id UUID REFERENCES chapters(id) ON DELETE CASCADE,
    score INT,
    total_questions INT,
    completed_at TIMESTAMPTZ
  )
  `,
];

const runMigrations = async () => {
  try {
    for (const sql of migrations) {
      await query(sql);
    }
    console.log('Migrations complete');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error.message);
    process.exit(1);
  }
};

runMigrations();
