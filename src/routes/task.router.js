import { Router } from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import 
    { getTask, 
        createTask, 
        getTasks, 
        updateTask, 
        deleteTask 
    } from "../controllers/task.controller.js"

const router = Router()
router.route("/").get(verifyJWT ,getTasks).post(verifyJWT, createTask)
router.route("/:id").patch(verifyJWT, updateTask)
.delete(verifyJWT, deleteTask).get(verifyJWT, getTask)

export {router as taskRouter}