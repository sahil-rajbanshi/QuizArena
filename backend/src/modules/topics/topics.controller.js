import asyncHandler from '../../utils/asyncHandler.js';
import { successResponse } from '../../utils/apiResponse.js';
import * as topicService from './topics.service.js';

export const getAllTopics = asyncHandler(async (req, res) => {
  const topics = await topicService.getAllTopics();
  return successResponse(res, topics);
});

export const getTopicById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const topic = await topicService.getTopicById(id);
  return successResponse(res, topic);
});

export const createTopic = asyncHandler(async (req, res) => {
  const { name, slug, description, icon, display_order } = req.body;
  const topic = await topicService.createTopic(name, slug, description, icon, display_order);
  return successResponse(res, topic);
});

export const updateTopic = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const fields = req.body;
  const topic = await topicService.updateTopic(id, fields);
  return successResponse(res, topic);
});

export const deleteTopic = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const topic = await topicService.deleteTopic(id);
  return successResponse(res, topic);
});