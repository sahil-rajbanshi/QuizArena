import 'dotenv/config';
import { query } from '../src/config/db.js';

// One-time fix: convert TIMESTAMP (no timezone) columns to TIMESTAMPTZ.
// Existing values were written as Nepal local time but stored with no
// timezone marker, then misread as UTC on the way out — causing every
// displayed time to be off by exactly Nepal's +5:45 offset.
// This reinterprets the existing naive values as Asia/Kathmandu local
// time and converts them to true UTC-based timestamptz going forward.

const fixes = [
  `ALTER TABLE users ALTER COLUMN created_at TYPE TIMESTAMPTZ USING created_at AT TIME ZONE 'Asia/Kathmandu';`,
  `ALTER TABLE topics ALTER COLUMN created_at TYPE TIMESTAMPTZ USING created_at AT TIME ZONE 'Asia/Kathmandu';`,
  `ALTER TABLE chapters ALTER COLUMN created_at TYPE TIMESTAMPTZ USING created_at AT TIME ZONE 'Asia/Kathmandu';`,
  `ALTER TABLE questions ALTER COLUMN created_at TYPE TIMESTAMPTZ USING created_at AT TIME ZONE 'Asia/Kathmandu';`,
  `ALTER TABLE options ALTER COLUMN created_at TYPE TIMESTAMPTZ USING created_at AT TIME ZONE 'Asia/Kathmandu';`,
  `ALTER TABLE progress ALTER COLUMN attempted_at TYPE TIMESTAMPTZ USING attempted_at AT TIME ZONE 'Asia/Kathmandu';`,
  `ALTER TABLE quiz_sessions ALTER COLUMN completed_at TYPE TIMESTAMPTZ USING completed_at AT TIME ZONE 'Asia/Kathmandu';`,
  `ALTER TABLE refresh_tokens ALTER COLUMN created_at TYPE TIMESTAMPTZ USING created_at AT TIME ZONE 'Asia/Kathmandu';`,
];

const run = async () => {
  try {
    for (const sql of fixes) {
      console.log('Running:', sql.slice(0, 60) + '...');
      await query(sql);
    }
    console.log('✅ All timestamp columns converted to TIMESTAMPTZ');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
};

run();