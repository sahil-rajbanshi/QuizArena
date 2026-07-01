import axiosInstance from "./axiosInstance";

export const createTopic = async (data) => {
  const res = await axiosInstance.post("/topics", data);
  return res.data;
};

export const updateTopic = async (id, data) => {
  const res = await axiosInstance.put(`/topics/${id}`, data);
  return res.data;
};

export const deleteTopic = async (id) => {
  const res = await axiosInstance.delete(`/topics/${id}`);
  return res.data;
};

export const createChapter = async (data) => {
  const res = await axiosInstance.post("/chapters", data);
  return res.data;
};

export const updateChapter = async (id, data) => {
  const res = await axiosInstance.put(`/chapters/${id}`, data);
  return res.data;
};

export const deleteChapter = async (id) => {
  const res = await axiosInstance.delete(`/chapters/${id}`);
  return res.data;
};

export const createQuestion = async (data) => {
  const res = await axiosInstance.post("/questions", data);
  return res.data;
};

export const updateQuestion = async (id, data) => {
  const res = await axiosInstance.put(`/questions/${id}`, data);
  return res.data;
};

export const deleteQuestion = async (id) => {
  const res = await axiosInstance.delete(`/questions/${id}`);
  return res.data;
};

export const createOption = async (data) => {
  const res = await axiosInstance.post("/options", data);
  return res.data;
};

export const updateOption = async (id, data) => {
  const res = await axiosInstance.put(`/options/${id}`, data);
  return res.data;
};

export const deleteOption = async (id) => {
  const res = await axiosInstance.delete(`/options/${id}`);
  return res.data;
};