import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes";
import lostItemRoutes from "./routes/lostItem.routes";
import foundItemRoutes from "./routes/foundItem.routes";
import chatRoutes from "./routes/chat.routes";
import userRoutes from "./routes/user.routes";
import path from "path";


const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRoutes);
app.use("/lost-items", lostItemRoutes);
app.use("/found-items", foundItemRoutes);
app.use("/chat", chatRoutes);
app.use("/users", userRoutes);
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

const PORT = 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

server.on("error", (err: any) => {
  if (err.code === "EACCES") {
    console.error(`Permission denied. Port ${PORT} requires elevated privileges.`);
  } else if (err.code === "EADDRINUSE") {
    console.error(`Port ${PORT} is already in use.`);
  } else {
    console.error(err);
  }
  process.exit(1);
});
