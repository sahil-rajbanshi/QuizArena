// src/modules/progress/progress.service.js
import { query } from '../../config/db.js';

export async function saveAnswer(user_id, question_id, selected_option_id) {
  const optionResult = await query(
    'SELECT id, is_correct FROM options WHERE question_id = $1 AND (id = $2 OR is_correct = true)',
    [question_id, selected_option_id]
  );
  const submitted = optionResult.rows.find(r => r.id === selected_option_id);
  if (!submitted) {
    const error = new Error('Invalid option for this question');
    error.statusCode = 400;
    throw error;
  }
  const is_correct = submitted.is_correct;
  const correct_option_id = (optionResult.rows.find(r => r.is_correct) || submitted).id;

  const result = await query(
    `INSERT INTO progress (user_id, question_id, selected_option_id, is_correct)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [user_id, question_id, selected_option_id, is_correct]
  );
  return { ...result.rows[0], correct_option_id };
}

export async function getUserProgress(user_id) {
  const sql = `
    SELECT
      p.id,
      p.user_id,
      p.question_id,
      p.selected_option_id,
      p.is_correct,
      p.attempted_at,
      q.question_text,
      q.chapter_id,
      c.name AS chapter_name,
      c.topic_id,
      t.name AS topic_name
    FROM progress p
    JOIN questions q ON p.question_id = q.id
    JOIN chapters c ON q.chapter_id = c.id
    JOIN topics t ON c.topic_id = t.id
    WHERE p.user_id = $1
    ORDER BY p.attempted_at DESC
  `;
  const result = await query(sql, [user_id]);
  return result.rows;
}

export async function getProgressSummary(user_id) {
  const sql = `
    SELECT
      c.id AS chapter_id,
      c.name AS chapter_name,
      COUNT(p.id) AS total_attempted,
      SUM(CASE WHEN p.is_correct THEN 1 ELSE 0 END) AS total_correct,
      ROUND(
        (SUM(CASE WHEN p.is_correct THEN 1 ELSE 0 END)::DECIMAL / NULLIF(COUNT(p.id), 0)) * 100,
        2
      ) AS accuracy
    FROM progress p
    JOIN questions q ON p.question_id = q.id
    JOIN chapters c ON q.chapter_id = c.id
    WHERE p.user_id = $1
    GROUP BY c.id, c.name
    ORDER BY c.name
  `;
  const result = await query(sql, [user_id]);
  return result.rows;
}