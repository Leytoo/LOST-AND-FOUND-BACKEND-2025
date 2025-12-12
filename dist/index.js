"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const lostItem_routes_1 = __importDefault(require("./routes/lostItem.routes"));
const foundItem_routes_1 = __importDefault(require("./routes/foundItem.routes"));
const chat_routes_1 = __importDefault(require("./routes/chat.routes"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use("/auth", auth_routes_1.default);
app.use("/lost-items", lostItem_routes_1.default);
app.use("/found-items", foundItem_routes_1.default);
app.use("/chat", chat_routes_1.default);
app.use("/uploads", express_1.default.static(path_1.default.join(__dirname, "../uploads")));
const PORT = 5000;
const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
server.on("error", (err) => {
    if (err.code === "EACCES") {
        console.error(`Permission denied. Port ${PORT} requires elevated privileges.`);
    }
    else if (err.code === "EADDRINUSE") {
        console.error(`Port ${PORT} is already in use.`);
    }
    else {
        console.error(err);
    }
    process.exit(1);
});
