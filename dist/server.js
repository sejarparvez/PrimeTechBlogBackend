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
var Port = process.env.PORT;
app.use((0, cors_1.default)());
app.get("/", function (req, res) {
    res.send("Hello, world!");
});
app.listen(Port, function () {
    console.log("Server is listening on port ".concat(Port));
});
