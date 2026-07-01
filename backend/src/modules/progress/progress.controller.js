// src/modules/progress/progress.controller.js
import asyncHandler from '../../utils/asyncHandler.js';
import { successResponse } from '../../utils/apiResponse.js';
import * as progressService from './progress.service.js';

export const saveAnswer = asyncHandler(async (req, res) => {
  const user_id = req.user.id;
  const { question_id, selected_option_id } = req.body;
  const progress = await progressService.saveAnswer(user_id, question_id, selected_option_id);
  return successResponse(res, progress);
});

export const getUserProgress = asyncHandler(async (req, res) => {
  const user_id = req.user.id;
  const progress = await progressService.getUserProgress(user_id);
  return successResponse(res, progress);
});

export const getProgressSummary = asyncHandler(async (req, res) => {
  const user_id = req.user.id;
  const summary = await progressService.getProgressSummary(user_id);
  return successResponse(res, summary);
});