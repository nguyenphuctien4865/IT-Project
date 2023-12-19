import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import { createError } from "../utils/error.js";
import jwt from "jsonwebtoken";
import { saveFileObj } from "../utils/saveFile.js";
import { getUrlImageObj } from "../utils/getUrlImage.js";
import { generateCode } from "../utils/generatePassword.js";
import { sendEmail } from "../utils/sendEmail.js";

export const sendCodeVerify = async (req, res, next) => {
  try {
    const code = String(await generateCode(6));
    await sendEmail(req.body.email, "Your code", code);
    res.status(200).json({ code });
  } catch (error) {
    next(error);
  }
};

// create a new user
export const register = async (req, res, next) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    const image = req.body.img;

    const newUser = new User({
      ...req.body,
      password: hash,
    });
    await saveFileObj(newUser, image);
    await newUser.save();
    res.status(200).send("User has been created.");
  } catch (err) {
    next(err);
  }
}

// login to set token
export const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return next(createError(404, "User not found!"));

    // compare password in mongoose vs frontend
    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isPasswordCorrect) {
      res.status(200).json({
        status: "Wrong password or email!",
        success: false
      });
      return;
    }
    //return next(createError(400, "Wrong password or email!"));

    // create a new token for backend
    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT
    );
    const { password, img, ...otherDetails } = user._doc;
    // set cookie token for backend
    let imgPath;
    if (user.img === null)
      imgPath = user.avatar;
    else
      imgPath = getUrlImageObj(img);
    //res.cookie("access_token")
    res
      .cookie("access_token", token)
      .status(200)
      .json({ ...otherDetails, imgPath: imgPath });
  } catch (err) {
    next(err);
  }
}




