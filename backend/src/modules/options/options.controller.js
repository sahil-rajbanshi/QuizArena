// src/modules/options/options.controller.js
import asyncHandler from '../../utils/asyncHandler.js';
import { successResponse } from '../../utils/apiResponse.js';
import * as optionService from './options.service.js';

export const createOption = asyncHandler(async (req, res) => {
  const { question_id, option_text, is_correct } = req.body;
  const option = await optionService.createOption(question_id, option_text, is_correct);
  return successResponse(res, option);
});

export const updateOption = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const fields = req.body;
  const option = await optionService.updateOption(id, fields);
  return successResponse(res, option);
});

export const deleteOption = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const option = await optionService.deleteOption(id);
  return successResponse(res, option);
});