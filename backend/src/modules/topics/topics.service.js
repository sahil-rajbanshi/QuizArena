import { query } from '../../config/db.js';

export async function getAllTopics() {
  const result = await query('SELECT * FROM topics ORDER BY display_order ASC');
  return result.rows;
}

export async function getTopicById(id) {
  const result = await query('SELECT * FROM topics WHERE id = $1', [id]);
  if (result.rows.length === 0) {
    const error = new Error('Topic not found');
    error.statusCode = 404;
    throw error;
  }
  return result.rows[0];
}

export async function createTopic(name, slug, description, icon, display_order) {
  const result = await query(
    `INSERT INTO topics (name, slug, description, icon, display_order)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [name, slug, description, icon, display_order]
  );
  return result.rows[0];
}

export async function updateTopic(id, fields) {
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
    UPDATE topics
    SET ${setClauses.join(', ')}
    WHERE id = $${idx}
    RETURNING *
  `;

  const result = await query(queryText, values);
  if (result.rows.length === 0) {
    const error = new Error('Topic not found');
    error.statusCode = 404;
    throw error;
  }
  return result.rows[0];
}

export async function deleteTopic(id) {
  const result = await query('DELETE FROM topics WHERE id = $1 RETURNING *', [id]);
  if (result.rows.length === 0) {
    const error = new Error('Topic not found');
    error.statusCode = 404;
    throw error;
  }
  return result.rows[0];
}