const User = require('../model/user.model')
const TempRegistration = require("../model/tempRegistration.model");
const bcrypt = require("bcryptjs")
const OTP = require('../model/otp.model')
const { sendOtpEmail } = require('../utils/email.utils');

const jwt = require('jsonwebtoken')

const register = async (req, res) => {

  try {
    const { name, email, password,role} = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    const existingUser = await User.findOne({
        email
    })

    if (existingUser) {
  return res.status(409).json({
    message: "Email already registered"
  });
}

const hashedPassword = await bcrypt.hash(password, 10);

await TempRegistration.create({
 name,
  email,
  password: hashedPassword,
  role
})

const otp = Math.floor(100000 + Math.random() * 900000).toString();

await OTP.create({
     email,
     otp,
     expiresAt: new Date(Date.now() + 5 * 60 * 1000)
})

await sendOtpEmail(email,otp)

return res.status(200).json({
  message: "OTP sent successfully",
});









  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Server error"
    });
  }
};


const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const existingOtp = await OTP.findOne({ email });

    if (!existingOtp) {
      return res.status(400).json({
        message: "OTP not found"
      });
    }

    if (existingOtp.otp !== otp) {
  return res.status(400).json({
    message: "Invalid OTP"
  });
}

if (existingOtp.expiresAt < new Date()) {
  return res.status(400).json({
    message: "OTP expired"
  });
}


const tempUser = await TempRegistration.findOne({ email });

if (!tempUser) {
  return res.status(400).json({
    message: "Registration data not found"
  });
}

const user = await User.create({
  name: tempUser.name,
  email: tempUser.email,
  password: tempUser.password,
  role: tempUser.role
});

await TempRegistration.deleteOne({ email });
await OTP.deleteOne({ email });


return res.status(201).json({
  message: "Registration successful",
  user
});





  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Server error"
    });
  }
};


const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(409).json({
      message: "No user found",
    });
  }

  const isPasswordCorrect = await bcrypt.compare(
    password,
    user.password
  );

  if (!isPasswordCorrect) {
    return res.status(401).json({
      message: "Invalid email or password",
    });
  }

  const token = jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );

  // JWT cookie
  res.cookie("token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.status(200).json({
    message: "Login successful",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
};


module.exports = {
  register,
  verifyOtp,
  login
};