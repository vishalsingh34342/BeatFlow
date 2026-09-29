const User = require("../model/user.model");
const Music = require("../model/music.model");

const getAllUser = async (req, res) => {

    try {

        const users = await User.find({}).select("-password");

        res.status(200).json({
            message: "All users fetched successfully",
            users: users
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server error"
        });

    }
};


const deleteUser = async (req, res) => {

    try {

        const { id } = req.params;

        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        if (user.role === "admin") {
            return res.status(403).json({
                message: "Admin cannot be deleted"
            });
        }

        await User.findByIdAndDelete(id);

        res.status(200).json({
            message: "User deleted successfully"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


const changeUserRole = async (req, res) => {
    try{
        const {id} = req.params;
        const {role} = req.body;


            const user = await User.findById(id);

            if(!user){
                   return res.status(404).json({
                message: "User not found"
            });
            }

              if (req.user.id === id) {
            return res.status(403).json({
                message: "You cannot change your own role"
            });
        }


        
   // Valid roles
        if (!["user", "artist", "admin"].includes(role)) {
            return res.status(400).json({
                message: "Invalid role"
            });
        }


         user.role = role;

        await user.save();

          res.status(200).json({
            message: "User role updated successfully",
            user
        });


    }



    catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server error"
        });

    }
}



const getAllSongs = async (req, res) => {

    try {

        const songs = await Music.find({});

        res.status(200).json({
            message: "All songs fetched successfully",
            songs: songs
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server error"
        });

    }
};

const deleteSong = async (req, res) => {

    try {

        const { id } = req.params;

        const song = await Music.findById(id);

        if (!song) {
            return res.status(404).json({
                message: "Song not found"
            });
        }

        await Music.findByIdAndDelete(id);

        res.status(200).json({
            message: "Song deleted successfully"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server error"
        });

    }
};

const getAllArtists = async (req, res) => {
    try {

        const artists = await User.find({
            role: "artist"
        }).select("-password");

        res.status(200).json({
            message: "All artists fetched successfully",
            artists
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


module.exports = {
    getAllUser,deleteUser,changeUserRole,getAllSongs,deleteSong,getAllArtists
};