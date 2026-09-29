const express = require("express"); 
const router = express.Router();
const { getProfile,getSongs,createPlaylist,getMyPlaylists,addSongToPlaylist,removeSongFromPlaylist,deletePlaylist,updateProfile, likeSong,
  unlikeSong,
  getLikedSongs } = require('../controllers/user.controller')
const authMiddleware = require('../middleware/auth.middleware')


router.get("/profile", authMiddleware, getProfile);

router.get(
    "/songs",
    authMiddleware,
    getSongs
);

router.post(
    "/playlists",
    authMiddleware,
    createPlaylist
);

router.get(
  "/playlists",
  authMiddleware,
  getMyPlaylists
);

router.patch(
  "/playlists/add-song",
  authMiddleware,
  addSongToPlaylist
);

router.patch(
  "/playlists/remove-song",
  authMiddleware,
  removeSongFromPlaylist
);

router.delete(
  "/playlists/:playlistId",
  authMiddleware,
  deletePlaylist
);

router.patch(
  "/profile",
  authMiddleware,
  updateProfile
);

router.get(
  "/liked-songs",
  authMiddleware,
  getLikedSongs
);

router.post(
  "/liked-songs/:songId",
  authMiddleware,
  likeSong
);

router.delete(
  "/liked-songs/:songId",
  authMiddleware,
  unlikeSong
);



module.exports = router;