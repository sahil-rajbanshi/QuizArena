// src/modules/chapters/chapters.service.js
import { query } from '../../config/db.js';

export async function getAllChapters(topic_id) {
  let sql = 'SELECT * FROM chapters';
  const params = [];
  if (topic_id) {
    sql += ' WHERE topic_id = $1 ORDER BY display_order ASC';
    params.push(topic_id);
  } else {
    sql += ' ORDER BY display_order ASC';
  }
  const result = await query(sql, params);
  return result.rows;
}

export async function getChapterById(id) {
  const result = await query('SELECT * FROM chapters WHERE id = $1', [id]);
  if (result.rows.length === 0) {
    const error = new Error('Chapter not found');
    error.statusCode = 404;
    throw error;
  }
  return result.rows[0];
}

export async function createChapter(topic_id, name, slug, description, display_order) {
  const result = await query(
    `INSERT INTO chapters (topic_id, name, slug, description, display_order)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [topic_id, name, slug, description, display_order]
  );
  return result.rows[0];
}

export async function updateChapter(id, fields) {
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
    UPDATE chapters
    SET ${setClauses.join(', ')}
    WHERE id = $${idx}
    RETURNING *
  `;

  const result = await query(queryText, values);
  if (result.rows.length === 0) {
    const error = new Error('Chapter not found');
    error.statusCode = 404;
    throw error;
  }
  return result.rows[0];
}

export async function deleteChapter(id) {
  const result = await query('DELETE FROM chapters WHERE id = $1 RETURNING *', [id]);
  if (result.rows.length === 0) {
    const error = new Error('Chapter not found');
    error.statusCode = 404;
    throw error;
  }
  return result.rows[0];
}