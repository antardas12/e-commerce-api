import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
export const verfiyJWT =asyncHandler(async (req,_,next)=>{
    try {
        const token = req.cookies?.accessToken || req.header("authorization").replace("bearer ", "") ;
        if(!token){
            throw new ApiError(400, "Unauthorize request ")
        }

        const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decodedToken._id).select("-password -refreshToken")
        if(!user){
            throw new ApiError(200, "invalid access token")
        }
        
        req.user=user;
        next();
        


    } catch (error) {
        throw new ApiError(Error.message || "invalid access Token")
    }
})