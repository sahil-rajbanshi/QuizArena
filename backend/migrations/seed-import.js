import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { query } from '../src/config/db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataPath = path.join(__dirname, 'mcq-dataset.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

const seed = async () => {
  let topicCount = 0;
  let chapterCount = 0;
  let questionCount = 0;
  let optionCount = 0;

  try {
    for (const topic of data.topics) {
      const topicRes = await query(
        `INSERT INTO topics (name, slug, description, icon, display_order)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (slug) DO UPDATE SET
           name = EXCLUDED.name,
           description = EXCLUDED.description,
           icon = EXCLUDED.icon,
           display_order = EXCLUDED.display_order
         RETURNING id`,
        [topic.name, topic.slug, topic.description, topic.icon, topic.display_order]
      );
      const topicId = topicRes.rows[0].id;
      topicCount++;
      console.log(`Topic: ${topic.name}`);

      for (const chapter of topic.chapters) {
        const chapterRes = await query(
          `INSERT INTO chapters (topic_id, name, slug, description, display_order)
           VALUES ($1, $2, $3, $4, $5)
           ON CONFLICT (topic_id, slug) DO UPDATE SET
             name = EXCLUDED.name,
             description = EXCLUDED.description,
             display_order = EXCLUDED.display_order
           RETURNING id`,
          [topicId, chapter.name, chapter.slug, chapter.description, chapter.display_order]
        );
        const chapterId = chapterRes.rows[0].id;
        chapterCount++;
        console.log(`  Chapter: ${chapter.name} (${chapter.questions.length} questions)`);

        // Clear out old questions for this chapter so re-running the seed
        // doesn't create duplicates (options/progress cascade automatically).
        await query(`DELETE FROM questions WHERE chapter_id = $1`, [chapterId]);

        let displayOrder = 1;
        for (const q of chapter.questions) {
          const questionRes = await query(
            `INSERT INTO questions (chapter_id, question_text, difficulty, explanation, display_order)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING id`,
            [chapterId, q.question_text, q.difficulty, q.explanation, displayOrder++]
          );
          const questionId = questionRes.rows[0].id;
          questionCount++;

          for (const opt of q.options) {
            await query(
              `INSERT INTO options (question_id, option_text, is_correct)
               VALUES ($1, $2, $3)`,
              [questionId, opt.option_text, opt.is_correct]
            );
            optionCount++;
          }
        }
      }
    }

    console.log('\nSeed complete:');
    console.log(`  Topics:    ${topicCount}`);
    console.log(`  Chapters:  ${chapterCount}`);
    console.log(`  Questions: ${questionCount}`);
    console.log(`  Options:   ${optionCount}`);
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error.message);
    console.error(error);
    process.exit(1);
  }
};

seed();
