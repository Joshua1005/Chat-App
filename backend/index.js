import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { port, secretTokens } from "./config/keys.js";
import passportConfig from "./config/passport.js";
import setupDB from "./utils/setupDB.js";
import router from "./routes/api/auth.js";
import cors from "cors";
import { corsOptions } from "./config/cors.js";
import cookieParser from "cookie-parser";
import auth from "./utils/auth.js";
import jwt from "jsonwebtoken";
import User from "./models/user.js";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: corsOptions,
  connectionStateRecovery: {},
});

passportConfig(app);
setupDB();

app
  .use(express.urlencoded({ extended: false }))
  .use(express.json())
  .use(cors(corsOptions))
  .use(cookieParser())
  .use("/user", router)
  .get("/protected", auth, (request, response) => {
    response.send("Hello");
  });

server.listen(port, () =>
  console.log(`Server running on port: ${port}\nhttp://localhost:${port}`)
);

io.use(async (socket, next) => {
  try {
    const authHeader = socket.handshake.headers.authorization;
    if (!authHeader) throw new Error("No headers.");
    const accessToken = authHeader.split(" ")[1];
    if (!accessToken) throw new Error("No access tokens.");
    const decoded = jwt.verify(accessToken, secretTokens.accessTokenSecret);

    const foundUser = await User.findOne({ email: decoded.email });
    if (!foundUser) throw new Error("Unathorized.");

    socket.user = foundUser;
    next();
  } catch (error) {
    console.error(error);
  }
}).on("connection", (socket) => {
  const userName = socket.user.name
    .split(" ")
    .map((name) => name.charAt(0))
    .join("");

  socket.on("sendMessage", (message) => {
    io.emit("sendMessage", { userName, message });
  });
});
