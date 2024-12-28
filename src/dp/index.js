import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";
const connectDB = async ()=>{
    try {
        const conecntInstance = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
        console.log(`MONGODB CONNECTED !! DB HOST !! ${conecntInstance.connection.host}`);
    } catch (error) {
        console.log("mongodb connected ", error)
    }
}

export default connectDB;