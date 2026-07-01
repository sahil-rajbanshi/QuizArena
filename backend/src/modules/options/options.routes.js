// src/modules/options/options.routes.js
import { Router } from 'express';
import { z } from 'zod';
import {
  createOption,
  updateOption, 
  deleteOption
} from './options.controller.js';
import auth from '../../middlewares/auth.js';
import isAdmin from '../../middlewares/isAdmin.js';
import validate from '../../middlewares/validate.js';

const router = Router();

const createOptionSchema = z.object({
  question_id: z.string().uuid(),
  option_text: z.string().min(1),
  is_correct: z.boolean().default(false)
});

const updateOptionSchema = z.object({
  question_id: z.string().uuid().optional(),
  option_text: z.string().min(1).optional(),
  is_correct: z.boolean().optional()
});

router.post('/', auth, isAdmin, validate(createOptionSchema), createOption);
router.put('/:id', auth, isAdmin, validate(updateOptionSchema), updateOption);
router.delete('/:id', auth, isAdmin, deleteOption);

export default router;