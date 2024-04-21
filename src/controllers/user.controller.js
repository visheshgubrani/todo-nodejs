import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const options = {
    httpOnly: true,
    secure: true
}

const generateAccessAndRefreshToken = async (userid) => {
    try {
        const user = await User.findById(userid)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({validateBeforeSave: false})
        return {accessToken, refreshToken}
    } catch (error) {
        throw new ApiError(500, "Somwthing went wrong while generating tokens")
    }
}

const registerUser = asyncHandler(async(req, res) => {
    // Get the info from the frontend
    const {fullName, userName, email, password} = req.body

    if (!(fullName && userName && email && password)) {
        throw new ApiError(400, 'Please provide all details')
    }

    const existedUser = await User.findOne({
        $or: [{userName}, {email}]
    })

    if (existedUser) {
        throw new ApiError(400, 'User already Exists')
    }

    const user = await User.create({
        fullName,
        userName: userName.toLowerCase(),
        email,
        password
    })
    // why create the created if we can just use user? ask ai 
    const createdUser = await User.findById(user._id).select("-password -refreshToken")
    
    if (!createdUser) {
        throw new ApiError(500, 'Something went wrong while registering the user')
    }

    return res.status(201).json(
        new ApiResponse(201, 'User registered Successfully', createdUser)
    )
})

const loginUser = asyncHandler(async(req, res) => {
    const {email, userName, password} = req.body

    if (!(email || userName)) {
        throw new ApiError(400, "Please enter your username or email")
    }

    if (!password) {
        throw new ApiError(400, 'Please provide an password')
    }

    const user = await User.findOne({
        $or: [{email}, {userName}]
    })

    if (!user) {
        throw new ApiError(400, "User does not exist")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new ApiError(400, "Wrong Password")
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    if (!loggedInUser) {
        throw new ApiError(404, "Failed to log in")
    }

    return res.status(201).cookie("accessToken", accessToken, options).cookie("refreshToken", refreshToken, options).json(
        new ApiResponse(200, "User logged in successfully", {user: loggedInUser, accessToken, refreshToken})
    )
})

const logoutuser = asyncHandler(async(req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )
    return res.status(200).clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, "User Logged Out SuccessFully", {}))
})

export {registerUser, loginUser, logoutuser}