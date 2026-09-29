const express = require('express')
const authRoutes = require('./routes/auth.routes')
const cookieParser = require("cookie-parser");
const userRoutes = require('./routes/user.route')
const musicRoutes = require("./routes/music.route");
const adminRoutes = require('./routes/admin.routes')
const cors = require("cors");




const app = express()
app.use(cors({
  origin: "https://beat-flow-vjyb.vercel.app/",
  credentials: true
}));
app.use(express.json())
app.use(cookieParser());



app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/music", musicRoutes);
app.use("/api/admin", adminRoutes);



module.exports = app;