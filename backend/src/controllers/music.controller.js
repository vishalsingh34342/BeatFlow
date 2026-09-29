const Music = require('../model/music.model')
const {uploadMusicToCloud } = require('../utils/imagekit.util')


const createMusic = async (req, res) => {
  try {
    const { title } = req.body;

    if (!title || !req.files?.music?.[0]) {
      return res.status(400).json({
        message: "Title and music file are required",
      });
    }

    const musicFile = req.files.music[0];
    const coverFile = req.files.cover?.[0];

    // Audio upload
    const audioUrl = await uploadMusicToCloud(musicFile);

    // Cover optional hai
    let coverUrl;

    if (coverFile) {
      coverUrl = await uploadMusicToCloud(coverFile);
    }

    const music = await Music.create({
      title,
      artist: req.user.id,
      audioUrl,
      coverUrl,
    });

    return res.status(201).json({
      message: "Music created successfully",
      music,
    });
  } catch (error) {
    console.log("CREATE MUSIC ERROR:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};


const getMySongs = async(req,res)=> {
  try{
    const songs = await Music.find({
      artist : req.user.id
    })

        return res.status(200).json({
      message: "My songs fetched successfully",
      songs
    });``



  }
   catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Server error"
    });



}

}


const editMusic = async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;

    const music = await Music.findById(id);

    if (!music) {
      return res.status(404).json({
        message: "Music not found",
      });
    }

    // Ownership check
    if (music.artist.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You can only edit your own music",
      });
    }

    // Update title
    if (title) {
      music.title = title;
    }

    // New audio file
    const audioFile = req.files?.music?.[0];

    if (audioFile) {
      const audioUrl = await uploadMusicToCloud(audioFile);
      music.audioUrl = audioUrl;
    }

    // New cover image
    const coverFile = req.files?.cover?.[0];

    if (coverFile) {
      const coverUrl = await uploadMusicToCloud(coverFile);
      music.coverUrl = coverUrl;
    }

    await music.save();

    return res.status(200).json({
      message: "Music updated successfully",
      music,
    });
  } catch (error) {
    console.log("EDIT MUSIC ERROR:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};
const deleteMusic = async(req,res) => {
  try{
    const { id } = req.params;

    const music = await Music.findById(id)

        if (!music) {
      return res.status(404).json({
        message: "Music not found"
      });
    }

        if (music.artist.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You can only delete your own music"
      });
    }

        await Music.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Music deleted successfully"
    });




  }

catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Server error"
    });
  }
}





module.exports = {
  createMusic,getMySongs,editMusic,deleteMusic,
}