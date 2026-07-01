import axiosInstance from "./axiosInstance";

export const getAllTopics = async () => {
  const res = await axiosInstance.get("/topics");
  return res.data;
};

export const getTopicById = async (id) => {
  const res = await axiosInstance.get(`/topics/${id}`);
  return res.data;
};

export const getAllChapters = async (topicId) => {
  const res = await axiosInstance.get("/chapters", {
    params: { topic_id: topicId },
  });
  return res.data;
};

export const getChapterById = async (id) => {
  const res = await axiosInstance.get(`/chapters/${id}`);
  return res.data;
};

export const getAllQuestions = async (chapterId) => {
  const res = await axiosInstance.get("/questions", {
    params: { chapter_id: chapterId },
  });
  return res.data;
};

export const getQuestionById = async (id) => {
  const res = await axiosInstance.get(`/questions/${id}`);
  return res.data;
};

export const saveAnswer = async ({ question_id, selected_option_id }) => {
  const res = await axiosInstance.post("/progress", {
    question_id,
    selected_option_id,
  });
  return res.data;
};

export const getUserProgress = async () => {
  const res = await axiosInstance.get("/progress");
  return res.data;
};

export const getProgressSummary = async () => {
  const res = await axiosInstance.get("/progress/summary");
  return res.data;
};