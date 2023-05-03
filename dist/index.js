"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var cors_1 = __importDefault(require("cors"));
var dotenv_1 = __importDefault(require("dotenv"));
var express_1 = __importDefault(require("express"));
dotenv_1.default.config();
var app = (0, express_1.default)();
var port = process.env.PORT;
var allowedOrigin = process.env.ORIGIN;
var corsOptions = {
    origin: allowedOrigin,
    credentials: true,
};
// Add a CORS middleware to the app
app.use((0, cors_1.default)(corsOptions));
// Define your endpoints
app.get("/hello", function (req, res) {
    res.status(200).json("Hey Sejar parvez");
});
app.get("/bye", function (req, res) {
    res.status(200).json("Goodbye");
});
app.listen(port, function () {
    console.log("\u26A1 Server is listening on port ".concat(port));
});
