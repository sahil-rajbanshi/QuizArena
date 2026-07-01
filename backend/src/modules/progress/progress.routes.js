// src/modules/progress/progress.routes.js
import { Router } from 'express';
import { z } from 'zod';
import {
  saveAnswer,
  getUserProgress,
  getProgressSummary
} from './progress.controller.js';
import auth from '../../middlewares/auth.js';
import validate from '../../middlewares/validate.js';

const router = Router();

const saveAnswerSchema = z.object({
  question_id: z.string().uuid(),
  selected_option_id: z.string().uuid()
});

router.post('/', auth, validate(saveAnswerSchema), saveAnswer);
router.get('/', auth, getUserProgress);
router.get('/summary', auth, getProgressSummary);

export default router;