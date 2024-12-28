import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));
app.use(express.json({ limit: "18kb" }));
app.use(express.urlencoded({ extended: true, limit: "17kb" }));
app.use(express.static("public"));
app.use(cookieParser());

import userRouter from "./routes/user.route.js";
import productRouter from "./routes/product.route.js"
app.use("/api/v1/users",userRouter);
app.use("/api/v1/product",productRouter)

export { app }