import { Router } from "express";
import { loginUser, logoutuser, registerUser } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route('/register').post(registerUser)
router.route('/login').post(loginUser)

// Secured Routes
router.route('/logout').post(verifyJWT, logoutuser)

export {router}