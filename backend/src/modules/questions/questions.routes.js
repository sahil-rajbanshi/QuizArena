import { Router } from 'express';
import { z } from 'zod';
import {
  getAllQuestions,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion
} from './questions.controller.js';
import auth from '../../middlewares/auth.js';
import isAdmin from '../../middlewares/isAdmin.js';
import validate from '../../middlewares/validate.js';

const router = Router();

const createQuestionSchema = z.object({
  chapter_id: z.string().uuid(),
  question_text: z.string().min(1),
  difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
  explanation: z.string().optional(),
  display_order: z.number().int().optional()
});

const updateQuestionSchema = z.object({
  chapter_id: z.string().uuid().optional(),
  question_text: z.string().min(1).optional(),
  difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
  explanation: z.string().optional(),
  display_order: z.number().int().optional()
});

router.get('/', getAllQuestions);
router.get('/:id', getQuestionById);
router.post('/', auth, isAdmin, validate(createQuestionSchema), createQuestion);
router.put('/:id', auth, isAdmin, validate(updateQuestionSchema), updateQuestion);
router.delete('/:id', auth, isAdmin, deleteQuestion);

export default router;