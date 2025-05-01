import User from "../Models/user.model.js";
import jwt from "jsonwebtoken";
import axios from "axios";
import { generateUID } from "../Utils/generateUID.js";

const googleLogin = async (req, res) => {
  const { accessToken } = req.body;
  if (!accessToken) {
    return res.status(400).json({ message: "No access token provided" });
  }
  try {
    const googleResponse = await axios.get(
      `https://www.googleapis.com/oauth2/v3/userinfo?access_toeken=${accessToken}`
    );
    const userData = googleResponse.data;

    const userId = generateUID(10);

    const user = await User.findOne({ googleId: userData.sub });
    if (!user) {
      const newUser = new User({
        userId: userId,
        name: userData.name,
        email: userData.email,
        avatar: userData.picture,
        googleId: userData.sub,
        phoneNumber: null,
        address: null,
        contacts: [],
        contactRequests: [],
        blockedContacts: [],
      });
      await newUser.save();
    }

    user = await User.findOne({ googleId: userData.sub });
    const userInfo = user.toObject();
    delete userInfo.password;

    const token = jwt.sign(
      {
        UID: userInfo.userId,
        email: userInfo.email,
        name: userInfo.name,
        googleId: userInfo.googleId,
        avatar: userInfo.avatar,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      message: "Login successful",
      user: userData,
    });
  } catch (error) {
    console.error("Google OAuth error:", error);
    res.status(500).json({ message: "Authentication failed" });
  }
};

export { googleLogin };
