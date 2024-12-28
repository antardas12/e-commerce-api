import dotenv from "dotenv";
import connectDB from "./dp/index.js";
import { app } from "./app.js";

dotenv.config({
    path : '/.env'
});

connectDB()
.then(()=>{
app.listen(process.env.PORT || 800, ()=>{
    console.log(`server is running at port ${process.env.PORT}`)
})
})
.catch((error)=>{
    console.log("mongodb connection error ",error)
})