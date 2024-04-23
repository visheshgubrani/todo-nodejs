import { Task } from "../models/tasks.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createTask = asyncHandler(async(req, res) => {
    const {task, completed} = req.body

    if (!task) {
        throw new ApiError(400, "Please Enter the Task")
    }

    const todo = await Task.create({
        task,
        completed,
        owner: req.user?._id
    })

    /* 
    ---Another Method---
    const task = new Task({
        name, completed
    })

    const createdTask = await task.save()
    */

    if (!todo) {
        throw new ApiError(404, "Failed to create the task")
    }

    return res.status(201).json(
        new ApiResponse(201, "Task created successfully", todo)
    )
})

const getTasks = asyncHandler(async(req, res) => {
    const tasks = await Task.find({owner: req.user?._id})

    if (!tasks) {
        throw new ApiError(400, "Tasks not found")
    }

    return res.status(200).json(
        new ApiResponse(200, "Tasks fetched successfully", tasks)
    )
})

const updateTask = asyncHandler(async(req, res) => {
    const {task, completed} = req.body
    // why not _id tho, do more research on it
    if (!task) {
        throw new ApiError(400, "Please enter the task")
    }
    const id = req.params?.id

    if (!id) {
        throw new ApiError(400, "Please select the task to update")
    }

    const updatedTask = await Task.findByIdAndUpdate(
        id,
        {
            task,
            completed
        },
        {new: true}
    ).where('owner', req.user?._id)

    if (!updatedTask) {
        throw new ApiError(400, 'Failed to update the task')
    }

    return res.status(200).json(
        new ApiResponse(200, "Task Updated Successfully", updatedTask)
    )

})

const deleteTask = asyncHandler(async(req, res) => {
    const id = req.params?.id

    if (!id) {
        throw new ApiError(400, "Please select the task to delete")
    }

    const deletedTask = await Task.findByIdAndDelete(
        id
    ).where('owner', req.user?._id)
    if (!deletedTask) {
        throw new ApiError(400, "Failed to delete the task")
    }

    return res.status(200).json(
        new ApiResponse(200, "Deleted the task successfully", {})
    )

})

const getTask = asyncHandler(async(req, res) => {
    // const {id} = req.params
    const id = req.params?.id
    if (!id) {
        throw new ApiError(400, "Task not found")
    }

    const task = await Task.findById(id)
    if (!task) {
        throw new ApiError(400, "Failed to fetch the task")
    }

    return res.status(200).json(
        new ApiResponse(200, "Fetched Task Successfully", task)
    )
})

export {createTask, getTasks, updateTask, deleteTask, getTask}