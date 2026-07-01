// src/modules/options/options.service.js
import { query } from '../../config/db.js';

export async function createOption(question_id, option_text, is_correct) {
  const result = await query(
    `INSERT INTO options (question_id, option_text, is_correct)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [question_id, option_text, is_correct]
  );
  return result.rows[0];
}

export async function updateOption(id, fields) {
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
    UPDATE options
    SET ${setClauses.join(', ')}
    WHERE id = $${idx}
    RETURNING *
  `;

  const result = await query(queryText, values);
  if (result.rows.length === 0) {
    const error = new Error('Option not found');
    error.statusCode = 404;
    throw error;
  }
  return result.rows[0];
}

export async function deleteOption(id) {
  const result = await query('DELETE FROM options WHERE id = $1 RETURNING *', [id]);
  if (result.rows.length === 0) {
    const error = new Error('Option not found');
    error.statusCode = 404;
    throw error;
  }
  return result.rows[0];
}