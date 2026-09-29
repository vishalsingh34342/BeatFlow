const User = require('../model/user.model')
const Music = require("../model/music.model");
const Playlist = require("../model/playlist.model");

    
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    return res.status(200).json({
      message: "Profile fetched successfully",
      user
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Server error"
    });
  }
};

const getSongs = async (req, res) => {

    try {

        const songs = await Music.find({});

        res.status(200).json({
            message: "Songs fetched successfully",
            songs: songs
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server error"
        });

    }
};

const createPlaylist = async (req, res) => {
  try{
    const {name} = req.body;

     if (!name) {
            return res.status(400).json({
                message: "Playlist name is required"
            });
        }

       const playlist = await Playlist.create({
            name: name,
            user: req.user.id
        });

            res.status(201).json({
            message: "Playlist created successfully",
            playlist: playlist
        });


  }
  catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server error"
        });

    }
}

const getMyPlaylists = async (req, res) => {
  try {
    const playlists = await Playlist.find({
      user: req.user.id
    }).populate("songs");

    res.status(200).json({
      message: "My playlists fetched successfully",
      playlists
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server error"
    });
  }
};

const addSongToPlaylist = async (req, res) => {
  try {
    const { playlistId, songId } = req.body;

    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
      return res.status(404).json({
        message: "Playlist not found"
      });
    }

    // Check playlist belongs to logged-in user
    if (playlist.user.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        message: "You can only modify your own playlist"
      });
    }

    // Prevent duplicate song
    const alreadyExists = playlist.songs.some(
      (id) => id.toString() === songId.toString()
    );

    if (alreadyExists) {
      return res.status(400).json({
        message: "Song already exists in playlist"
      });
    }

    playlist.songs.push(songId);

    await playlist.save();

    res.status(200).json({
      message: "Song added to playlist",
      playlist
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server error"
    });
  }
};

const removeSongFromPlaylist = async (req, res) => {
  try {
    const { playlistId, songId } = req.body;

    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
      return res.status(404).json({
        message: "Playlist not found",
      });
    }

    // Check ownership
    if (playlist.user.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        message: "You can only modify your own playlist",
      });
    }

    // Check if song exists in playlist
    const songExists = playlist.songs.some(
      (id) => id.toString() === songId.toString()
    );

    if (!songExists) {
      return res.status(404).json({
        message: "Song not found in playlist",
      });
    }

    // Remove song
    playlist.songs = playlist.songs.filter(
      (id) => id.toString() !== songId.toString()
    );

    await playlist.save();

    // Populate remaining songs
    await playlist.populate("songs");

    return res.status(200).json({
      message: "Song removed from playlist",
      playlist,
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};
const deletePlaylist = async (req, res) => {
  try{
     const { playlistId } = req.params;

     const playlist = await Playlist.findById(playlistId);

       if (!playlist) {
      return res.status(404).json({
        message: "Playlist not found"
      });
    }

     if (playlist.user.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You can only delete your own playlist"
      });
    }

    await Playlist.findByIdAndDelete(playlistId);

    res.status(200).json({
      message: "Playlist deleted successfully"
    });


  }

  catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server error"
    });
  }
}

const updateProfile = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Name is required"
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    user.name = name;

    await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server error"
    });
  }
};


const likeSong = async (req, res) => {
  try {
    const { songId } = req.params;

    const song = await Music.findById(songId);

    if (!song) {
      return res.status(404).json({
        message: "Song not found",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        $addToSet: {
          likedSongs: songId,
        },
      },
      { new: true }
    ).populate({
      path: "likedSongs",
      populate: {
        path: "artist",
        select: "name",
      },
    });

    res.status(200).json({
      message: "Song liked successfully",
      likedSongs: user.likedSongs,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};


const unlikeSong = async (req, res) => {
  try {
    const { songId } = req.params;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        $pull: {
          likedSongs: songId,
        },
      },
      { new: true }
    ).populate({
      path: "likedSongs",
      populate: {
        path: "artist",
        select: "name",
      },
    });

    res.status(200).json({
      message: "Song removed from liked songs",
      likedSongs: user.likedSongs,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};


const getLikedSongs = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: "likedSongs",
      populate: {
        path: "artist",
        select: "name",
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "Liked songs fetched successfully",
      likedSongs: user.likedSongs,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};








module.exports = {
    getSongs,getProfile,likeSong,unlikeSong, getLikedSongs,  createPlaylist,getMyPlaylists, addSongToPlaylist, removeSongFromPlaylist,deletePlaylist,updateProfile
};








