import api from "./api";

export const createPlaylist = async (name) => {
  const response = await api.post("/user/playlists", {
    name,
  });

  return response.data;
};

export const getMyPlaylists = async () => {
  const response = await api.get("/user/playlists");

  return response.data;
};
export const addSongToPlaylist = async (playlistId, songId) => {
  const response = await api.patch("/user/playlists/add-song", {
    playlistId,
    songId,
  });

  return response.data;
};


export const deletePlaylist = async (playlistId) => {
  const response = await api.delete(
    `/user/playlists/${playlistId}`
  );

  return response.data;
};

export const removeSongFromPlaylist = async (
  playlistId,
  songId
) => {
  const response = await api.patch(
    "/user/playlists/remove-song",
    {
      playlistId,
      songId,
    }
  );

  return response.data;
};