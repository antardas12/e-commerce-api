import { Router } from "express";
import { upload } from "../milddelweres/multer.middelwere.js";
import { changeCurrentPassword, logInUser, logOutUser, registerUser } from "../controllers/user.controller.js";
import { verfiyJWT } from "../milddelweres/auth.middelwere.js";

const router =Router();

router.route("/register").post(upload.single('avatar'),registerUser);
router.route("/login").post(logInUser);
router.route("/logout").post(verfiyJWT,logOutUser);
router.route("/change-password").post(verfiyJWT,changeCurrentPassword)

export default router;