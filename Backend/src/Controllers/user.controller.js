import User from "../Models/user.model.js";
import jwt from "jsonwebtoken";
import axios from "axios";
import { generateUID } from "../Utils/generateUID.js";

const googleLogin = async (req, res) => {
  const { accessToken } = req.body;
  // console.log("Access Token:", accessToken);
  if (!accessToken) {
    return res.status(400).json({ message: "No access token provided" });
  }
  try {
    const googleResponse = await axios.get(
      `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${accessToken}`
    );
    const userData = googleResponse.data;

    // console.log("User data from Google:", userData);

    const userId = generateUID(10);

    let user = await User.findOne({ googleId: userData.sub });
    if (!user) {
      const newUser = new User({
        uid: userId,
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
    // console.log("User info:", userInfo);

    const token = jwt.sign(
      {
        uid: userInfo.uid,
        email: userInfo.email,
        name: userInfo.name,
        googleId: userInfo.googleId,
        avatar: userInfo.avatar,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // console.log("Generated token:", token);

    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    delete userInfo.googleId;

    res.status(200).json({
      message: "Login successful",
      user: userInfo,
    });
  } catch (error) {
    console.error("Google OAuth error:", error);
    res.status(500).json({ message: "Authentication failed" });
  }
};

const fetchUser = async (req, res) => {
  // console.log("Fetching user:", req.user.uid);
  try {
    const users = await User.findOne({ uid: req.user.uid });
    if (!users) {
      // console.log("User not found:", users);
      return res.json({ user: {} });
      
    }
    console.log("User found:", users);
    res.json({
      user: {
        uid: users.uid,
        name: users.name,
        email: users.email,
        avatar: users.avatar,
        phoneNumber: users.phoneNumber,
        address: users.address,
      },
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Error fetching user" });
  }
};

const updateUserDetails = async (req, res) => {
  const { name, phone, address } = req.body;
  try {
    const user = await User.findOneAndUpdate(
      { uid: req.user.uid },
      {
        $set: {
          name: name,
          phoneNumber: phone,
          address: address,
        },
      },

      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User details updated successfully", user });
  } catch (error) {
    console.error("Error updating user details:", error);
    res.status(500).json({ message: "Error updating user details" });
  }
};

export { googleLogin, fetchUser, updateUserDetails };
