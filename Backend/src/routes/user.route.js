import { Router } from "express";
import { fetchUser, googleLogin, updateUserDetails } from "../Controllers/user.controller.js";
import { verifyToken } from "../Middlewares/auth.middleware.js";

const router = Router();

router.route("/google-login").post(googleLogin);
router.route("/fetch-user").get(verifyToken,fetchUser)
router.route("/update-user").post(verifyToken,updateUserDetails)


export default router;