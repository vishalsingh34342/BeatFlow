const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const allowRole = require("../middleware/role.middleware");
const upload = require('../middleware/upload.middleware')
const { createMusic } = require('../controllers/music.controller')
const {getMySongs} = require('../controllers/music.controller')
const {editMusic} = require('../controllers/music.controller')
const {deleteMusic} = require('../controllers/music.controller')


router.post(
  "/create",
  authMiddleware,
  allowRole("artist"),
  upload.fields([
    { name: "music", maxCount: 1 },
    { name: "cover", maxCount: 1 },
  ]),
  createMusic
);

router.get(
  "/my-songs",
  authMiddleware,
  allowRole("artist"),
  getMySongs
);

router.patch(
  "/:id",
  authMiddleware,
  allowRole("artist"),
  upload.fields([
    { name: "music", maxCount: 1 },
    { name: "cover", maxCount: 1 },
  ]),
  editMusic
);
router.delete(
  "/:id",
  authMiddleware,
  allowRole("artist"),
  deleteMusic
);
module.exports = router;