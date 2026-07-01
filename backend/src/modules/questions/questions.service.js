// src/modules/questions/questions.service.js
import { query } from '../../config/db.js';

export async function getAllQuestions(chapter_id) {
  let sql = 'SELECT * FROM questions';
  const params = [];
  if (chapter_id) {
    sql += ' WHERE chapter_id = $1 ORDER BY display_order ASC';
    params.push(chapter_id);
  } else {
    sql += ' ORDER BY display_order ASC';
  }
  const result = await query(sql, params);
  return result.rows;
}

export async function getQuestionById(id) {
  // Fetch question and its options in one query (LEFT JOIN)
  const sql = `
    SELECT q.*,
           o.id AS option_id,
           o.option_text,
           o.is_correct
    FROM questions q
    LEFT JOIN options o ON q.id = o.question_id
    WHERE q.id = $1
    ORDER BY o.id
  `;
  const result = await query(sql, [id]);
  if (result.rows.length === 0) {
    const error = new Error('Question not found');
    error.statusCode = 404;
    throw error;
  }

  // Build question object with options array
  const question = {
    id: result.rows[0].id,
    chapter_id: result.rows[0].chapter_id,
    question_text: result.rows[0].question_text,
    difficulty: result.rows[0].difficulty,
    explanation: result.rows[0].explanation,
    display_order: result.rows[0].display_order,
    created_at: result.rows[0].created_at,
    updated_at: result.rows[0].updated_at,
    options: []
  };

  for (const row of result.rows) {
    if (row.option_id) {
      question.options.push({
        id: row.option_id,
        option_text: row.option_text,
        is_correct: row.is_correct
      });
    }
  }

  return question;
}

export async function createQuestion(chapter_id, question_text, difficulty, explanation, display_order) {
  const result = await query(
    `INSERT INTO questions (chapter_id, question_text, difficulty, explanation, display_order)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [chapter_id, question_text, difficulty, explanation, display_order]
  );
  return result.rows[0];
}

export async function updateQuestion(id, fields) {
  const setClauses = [];
  const values = [];
  let idx = 1;

  for (const [key, value] of Object.entries(fields)) {
    setClauses.push(`${key} = $${idx}`);
    values.push(value);
    idx++;
  }

  if (setClauses.length === 0) {
    throw new Error('No fields provided for update');
  }

  values.push(id);
  const queryText = `
    UPDATE questions
    SET ${setClauses.join(', ')}
    WHERE id = $${idx}
    RETURNING *
  `;

  const result = await query(queryText, values);
  if (result.rows.length === 0) {
    const error = new Error('Question not found');
    error.statusCode = 404;
    throw error;
  }
  return result.rows[0];
}

export async function deleteQuestion(id) {
  // Assuming ON DELETE CASCADE on options, or we delete options manually
  const result = await query('DELETE FROM questions WHERE id = $1 RETURNING *', [id]);
  if (result.rows.length === 0) {
    const error = new Error('Question not found');
    error.statusCode = 404;
    throw error;
  }
  return result.rows[0];
}