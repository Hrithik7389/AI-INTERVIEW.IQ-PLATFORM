import genToken from "../config/token.js";
import User from "../models/user.model.js";

export const getTokenCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 24 * 60 * 60 * 1000,
});

export const googleAuth = async (req, res) => {
  try {

    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        message: "Name and email are required",
      });
    }

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
      });
    }

    const token = await genToken(user._id);

    res.cookie("token", token, getTokenCookieOptions());

    return res.status(200).json({
      success: true,
      user,
    });

  } catch (error) {

    return res.status(500).json({
      message: error.message,
    });

  }
};

export const logOut = async (req, res) => {
  try {

    res.clearCookie("token", getTokenCookieOptions());

    return res.status(200).json({
      success: true,
      message: "Logout Successfully",
    });

  } catch (error) {

    return res.status(500).json({
      message: error.message,
    });

  }
};