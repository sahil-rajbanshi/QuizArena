// src/modules/chapters/chapters.routes.js
import { Router } from 'express';
import { z } from 'zod';
import {
  getAllChapters,
  getChapterById,
  createChapter,
  updateChapter,
  deleteChapter
} from './chapters.controller.js';
import auth from '../../middlewares/auth.js';
import isAdmin from '../../middlewares/isAdmin.js';
import validate from '../../middlewares/validate.js';

const router = Router();

const createChapterSchema = z.object({
  topic_id: z.string().uuid(),
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  display_order: z.number().int().optional()
});

const updateChapterSchema = z.object({
  topic_id: z.string().uuid().optional(),
  name: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  description: z.string().optional(),
  display_order: z.number().int().optional()
});

router.get('/', getAllChapters);
router.get('/:id', getChapterById);
router.post('/', auth, isAdmin, validate(createChapterSchema), createChapter);
router.put('/:id', auth, isAdmin, validate(updateChapterSchema), updateChapter);
router.delete('/:id', auth, isAdmin, deleteChapter);

export default router;