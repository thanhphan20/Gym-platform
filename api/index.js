import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoute from "./routes/auth.js";
import usersRoute from "./routes/users.js";
import classesRoute from "./routes/classes.js";
import conversationRoute from "./routes/conversation.js";
import messageRoute from "./routes/message.js";
import trainerRoute from "./routes/trainer.js";
import cookieParser from "cookie-parser";
import cors from "cors";

import swaggerUI from "swagger-ui-express";
import swaggerOption from './swagger.js';

const app = express();
dotenv.config();

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log("Connected to mongoDB.");
  } catch (error) {
    throw error;
  }
};

mongoose.connection.on("disconnected", () => {
  console.log("mongoDB disconnected!");
});

//middlewares
app.use(cors())
app.use(cookieParser())
app.use(express.json());

app.use('/swagger', swaggerUI.serve, swaggerUI.setup(swaggerOption))

app.use("/api/auth", authRoute);
app.use("/api/user", usersRoute);
app.use("/api/classes", classesRoute);
app.use("/api/trainer", trainerRoute);
app.use("/api/conversation", conversationRoute);
app.use("/api/message", messageRoute);

app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: err.stack,
  });
});

app.listen(5000, () => {
  connect();
  console.log("Connected to backend.");
  console.log("http://localhost:5000/swagger")
});