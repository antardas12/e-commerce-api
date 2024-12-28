import mongoose from "mongoose";
import { type } from "os";
import bcrypt, { compare } from "bcrypt";
import jwt from "jsonwebtoken";



const userSchema = new mongoose.Schema(
    {
        fullname: {
            type: String,
            required: true
        },
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true

        },
        avatar: {
            type: String,
            requried: true

        },
        email: {
            type: String,
            required: true,
            unique: true, // Ensures that no two users can have the same email
            lowercase: true,
            match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
        },
        password: {
            type: String,
            required: true,
            minlength: 6 // Minimum password length
        },
        phone: {
            type: String,
            // required: true,
            match: [/^\d{10}$/, 'Please provide a valid phone number'] // Example for 10-digit phone numbers
        },
        role: {
            type: String,
            enum: ['admin', 'user', 'teacher', 'student'],
            default: 'user'
        },
        refreshToken : {
          type : String  
        }
    }, { timestamps: true }
);

userSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next();
    
    this.password = await bcrypt.hash(this.password,10)
    next()
});

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password,this.password)
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign({
        _id : this._id,
        fullname : this.fullname,
        email : this.email
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn : process.env.ACCESS_TOKEN_EXPIRY
    }
)
}
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign({
        _id : this._id,
        fullname : this.fullname,
        email : this.email
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn : process.env.REFRESH_TOKEN_EXPIRY
    }
)
}

export const User = mongoose.model("User",userSchema);