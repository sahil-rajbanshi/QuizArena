// src/modules/questions/questions.controller.js
import asyncHandler from '../../utils/asyncHandler.js';
import { successResponse } from '../../utils/apiResponse.js';
import * as questionService from './questions.service.js';

export const getAllQuestions = asyncHandler(async (req, res) => {
  const { chapter_id } = req.query;
  const questions = await questionService.getAllQuestions(chapter_id);
  return successResponse(res, questions);
});

export const getQuestionById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const question = await questionService.getQuestionById(id);
  const isAdmin = req.user?.role === 'admin';
  if (!isAdmin) {
    question.options = question.options.map(({ is_correct, ...rest }) => rest);
  }

  return successResponse(res, question);
});

export const createQuestion = asyncHandler(async (req, res) => {
  const { chapter_id, question_text, difficulty, explanation, display_order } = req.body;
  const question = await questionService.createQuestion(chapter_id, question_text, difficulty, explanation, display_order);
  return successResponse(res, question);
});

export const updateQuestion = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const fields = req.body;
  const question = await questionService.updateQuestion(id, fields);
  return successResponse(res, question);
});

export const deleteQuestion = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const question = await questionService.deleteQuestion(id);
  return successResponse(res, question);
});