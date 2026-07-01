// src/modules/topics/topics.routes.js
import { Router } from 'express';
import { z } from 'zod';
import {
  getAllTopics,
  getTopicById,
  createTopic,
  updateTopic,
  deleteTopic
} from './topics.controller.js';
import auth from '../../middlewares/auth.js';
import isAdmin from '../../middlewares/isAdmin.js';
import validate from '../../middlewares/validate.js';

const router = Router();

const createTopicSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  icon: z.string().optional(),
  display_order: z.number().int().optional()
});

const updateTopicSchema = z.object({
  name: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  description: z.string().optional(),
  icon: z.string().optional(),
  display_order: z.number().int().optional()
});

router.get('/', getAllTopics);
router.get('/:id', getTopicById);
router.post('/', auth, isAdmin, validate(createTopicSchema), createTopic);
router.put('/:id', auth, isAdmin, validate(updateTopicSchema), updateTopic);
router.delete('/:id', auth, isAdmin, deleteTopic);

export default router;