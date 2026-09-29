import api from "./api";

export const getSongs = async () => {
  const response = await api.get("/user/songs");
  return response.data;
};

export const getMySongs = async () => {
  const response = await api.get("/music/my-songs");
  return response.data;
};

export const deleteSong = async (songId) => {
  const response = await api.delete(`/music/${songId}`);
  return response.data;
};