import { Router } from "express";
import { googleLogin } from "../Controllers/user.controller.js";

const router = Router();

router.route("/google-login").post(googleLogin);


export default router;