
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        user.refreshToken = refreshToken;
        user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(400, "some thing want wrong while generate access and refresh token")
    }
}


const registerUser = asyncHandler(async (req, res) => {
    const { fullname, email, password, phone, username } = req.body;

    if (
        [fullname, password, phone, username, email].some((field) => field.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required");
    }

    const existUser = await User.findOne({
        $or: [{ email }, { username }]
    });

    if (existUser) {
        throw new ApiError(400, "username or email already register")
    }

    const avatarLocalPath = req.file.path;
    if (!avatarLocalPath) {
        throw new ApiError(400, "avatar is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);

    if (!avatar) {
        throw new ApiError(400, "error in upload avatar on cloudinary")
    }

    const user = await User.create({
        fullname,
        avatar: avatar.url,
        email,
        username,
        phone,
        password
    });

    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    return res.status(200).json(
        new ApiResponse(200, "user register successfully ", createdUser)
    )




});


const logInUser = asyncHandler(async (req, res) => {
    const { email, username, password } = req.body;
    if (!(email || username)) {
        throw new ApiError(400, "email or username are required")
    }

    const user = await User.findOne({
        $or: [{ email }, { username }]
    });

    if (!user) {
        throw new ApiError(404, "user are not register ")
    }

    const validPassword = await user.isPasswordCorrect(password);
    if (!validPassword) {
        throw new ApiError(400, "password is invalid ")
    }


    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const options = {
        httOnly: true,
        secure: true
    }

    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(200, "user login successfully", {
                user: loggedInUser, accessToken, refreshToken
            })
        )

});


const logOutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id, {
        $unset: {
            refreshToken: 1
        }
    }, {
        new: true
    }
    );

    const options = {
        httOnly: true,
        secure: true
    }

    return res.status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new ApiResponse(200, "user logout  successfully", {})
        )




});

const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    // if (!oldPassword && !newPassword) {
    //     throw new ApiError(400, "old and new password are required")
    // }
    const user = await User.findById(req.user?._id);
    const validPassword = await user.isPasswordCorrect(oldPassword);
    if (!validPassword) {
        throw new ApiError(400, "invalid old password ")
    }

    user.password=newPassword;
    await user.save({validateBeforeSave : false})



    return res.status(200).json(
        new ApiResponse(200,"change current password successfully ")
    )

})


export {
    registerUser,
    logInUser,
    logOutUser,
    changeCurrentPassword


}