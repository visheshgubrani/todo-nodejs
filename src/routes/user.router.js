import { Router } from "express";
import { loginUser, logoutuser, registerUser } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createTask, deleteTask, getTasks, updateTask } from "../controllers/task.controller.js";

const router = Router()

router.route('/register').post(registerUser)
router.route('/login').post(loginUser)

// Task Routes
router.route("/").get(verifyJWT ,getTasks).post(verifyJWT, createTask)
router.route("/:id").patch(verifyJWT, updateTask).delete(verifyJWT, deleteTask)

// Secured Routes
router.route('/logout').post(verifyJWT, logoutuser)

export {router}