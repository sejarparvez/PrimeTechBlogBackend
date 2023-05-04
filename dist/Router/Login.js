"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var bcrypt_1 = __importDefault(require("bcrypt"));
var dotenv_1 = __importDefault(require("dotenv"));
var express_1 = __importDefault(require("express"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var UserModel_1 = __importDefault(require("../Model/UserModel"));
dotenv_1.default.config();
var Login = express_1.default.Router();
var Secret = process.env.SECRET;
Login.post("/login", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, UserData, passOk;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, email = _a.email, password = _a.password;
                return [4 /*yield*/, UserModel_1.default.findOne({ Email: email })];
            case 1:
                UserData = _b.sent();
                if (!UserData) {
                    res.status(400).json("Wrong Email Password");
                    return [2 /*return*/];
                }
                passOk = UserData.Password && bcrypt_1.default.compareSync(password, UserData.Password);
                if (passOk) {
                    jsonwebtoken_1.default.sign({ email: email, name: UserData.Name, id: UserData._id }, "".concat(Secret), {}, function (error, token) {
                        if (error)
                            throw error;
                        res
                            .cookie("token", token, {
                            sameSite: "none",
                            secure: true,
                        })
                            .json({
                            id: UserData.id,
                            Name: UserData.Name,
                            Email: UserData.Email,
                        });
                    });
                }
                else {
                    res.status(400).json("Wrong Email Password");
                }
                return [2 /*return*/];
        }
    });
}); });
// ROUTER FOR LOGIN OUT
Login.post("/logout", function (req, res) {
    res.cookie("token", "").json("OK");
});
// ROUTER FOR PROFILE INFORMATION
Login.get("/profile", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var token, decoded;
    return __generator(this, function (_a) {
        try {
            token = req.cookies.token;
            if (!token) {
                return [2 /*return*/, res.status(401).json({ message: "No token Found" })];
            }
            decoded = jsonwebtoken_1.default.verify(token, "".concat(Secret));
            res.json(decoded);
        }
        catch (error) {
            console.error(error);
            res.status(401).json({ message: "Unauthorized" });
        }
        return [2 /*return*/];
    });
}); });
Login.get("/profile/:id", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, UserData;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.params.id;
                return [4 /*yield*/, UserModel_1.default.findById(id)];
            case 1:
                UserData = _a.sent();
                res.json(UserData);
                return [2 /*return*/];
        }
    });
}); });
exports.default = Login;
