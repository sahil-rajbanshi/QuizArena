// src/modules/chapters/chapters.controller.js
import asyncHandler from '../../utils/asyncHandler.js';
import { successResponse } from '../../utils/apiResponse.js';
import * as chapterService from './chapters.service.js';

export const getAllChapters = asyncHandler(async (req, res) => {
  const { topic_id } = req.query;
  const chapters = await chapterService.getAllChapters(topic_id);
  return successResponse(res, chapters);
});

export const getChapterById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const chapter = await chapterService.getChapterById(id);
  return successResponse(res, chapter);
});

export const createChapter = asyncHandler(async (req, res) => {
  const { topic_id, name, slug, description, display_order } = req.body;
  const chapter = await chapterService.createChapter(topic_id, name, slug, description, display_order);
  return successResponse(res, chapter);
});

export const updateChapter = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const fields = req.body;
  const chapter = await chapterService.updateChapter(id, fields);
  return successResponse(res, chapter);
});

export const deleteChapter = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const chapter = await chapterService.deleteChapter(id);
  return successResponse(res, chapter);
});