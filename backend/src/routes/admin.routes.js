const express = require("express");
const router = express.Router();

const {getAllUser,deleteUser,changeUserRole,getAllSongs,deleteSong,getAllArtists} = require('../controllers/admin.controller')
const authMiddleware = require('../middleware/auth.middleware')
const allowRole = require("../middleware/role.middleware");








router.get('/users', authMiddleware, allowRole('admin'),getAllUser)

router.delete(
    "/users/:id",
    authMiddleware,
    allowRole("admin"),
    deleteUser
);

router.patch(
    "/users/:id/role",
    authMiddleware,
    allowRole("admin"),
    changeUserRole
);

router.get(
    "/songs",
    authMiddleware,
    allowRole("admin"),
    getAllSongs
);

router.delete(
    "/songs/:id",
    authMiddleware,
    allowRole("admin"),
    deleteSong
);

router.get(
  "/artists",
  authMiddleware,
  allowRole("admin"),
  getAllArtists
);

module.exports = router;