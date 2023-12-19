import express from "express";
import passport from "passport";
import bcrypt from "bcryptjs";
import User from "../models/userModel.js"
import { sendEmail } from "../utils/sendEmail.js";
import { generatePassword } from "../utils/generatePassword.js";
import { getUrlImageObj } from "../utils/getUrlImage.js";
const router = express.Router();
const CLIENT_URL = "http://localhost:3000/";
const CLIENT_URL_ADMIN = "http://localhost:3001/";


router.get("/login/success", async (req, res) => {
    const data = req.user;
    if (data) {
        const oldUser = await User.findOne({ email: data.emails[0].value });
        if (oldUser !== null) {
            var { password, img, ...userData } = oldUser._doc;

            let imgPath;
            if (img === null)
                imgPath = userData.avatar;
            else
                imgPath = getUrlImageObj(img);
            const result = { ...userData, imgPath: imgPath }
            res.status(200).json({
                success: true,
                message: "successful",
                user: result,
                //   cookies: req.cookies
            })
        }
        // else is new user
        else {
            const pwd = String(await generatePassword(8));

            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(pwd, salt);

            const newUser = new User({
                name: data.displayName,
                email: data.emails[0].value,
                avatar: data.photos[0].value,
                password: hash,
            })
            await newUser.save();
            const imgPath = newUser.avatar;
            const { password, img, ...result } = { ...newUser._doc, imgPath: imgPath };
            // no need to wait for hight speed
            sendEmail(data.emails[0].value, "Your password", pwd);
            res.status(200).json({
                success: true,
                message: "successful",
                user: result,
                //   cookies: req.cookies
            })
        };
    }
});

router.get("/login/failed", (req, res) => {
    res.status(401).json({
        success: false,
        message: "failure",
    });
});

router.get("/logout", (req, res) => {
    req.logout();
    res.redirect(CLIENT_URL);
});

router.get("/logoutAdmin", (req, res) => {
    req.logout();
    res.redirect(CLIENT_URL_ADMIN);
});

// scope: get infor fields of user
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));


router.get(
    "/google/callback",
    passport.authenticate("google", {
        successRedirect: CLIENT_URL,
        failureRedirect: "/login/failed",
    })
);




export default router