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
var fs_1 = __importDefault(require("fs"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var multer_1 = __importDefault(require("multer"));
var Firebase_1 = __importDefault(require("../Firebase/Firebase"));
var UserModel_1 = __importDefault(require("../Model/UserModel"));
dotenv_1.default.config();
var Secret = process.env.SECRET || "";
var upload = (0, multer_1.default)({ dest: "uploads/" });
var Registration = express_1.default.Router();
var salt = bcrypt_1.default.genSalt(10);
var defaultImageUrl = "https://firebasestorage.googleapis.com/v0/b/primetech-e8527.appspot.com/o/Deafult%2FUser-Profile-PNG.png?alt=media&token=ecae5a27-2319-473a-bb3e-d4ddb25b4b39";
Registration.post("/registration", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, Name, Email, Bio, Password, socialLinks, Image, UserData, _b, _c, _d, _e, _f, error_1;
    var _g;
    return __generator(this, function (_h) {
        switch (_h.label) {
            case 0:
                _a = req.body, Name = _a.Name, Email = _a.Email, Bio = _a.Bio, Password = _a.Password;
                socialLinks = {
                    facebook: "",
                    twitter: "",
                    linkedin: "",
                    instagram: "",
                    github: "",
                    telegram: "",
                    website: "",
                };
                Image = defaultImageUrl;
                _h.label = 1;
            case 1:
                _h.trys.push([1, 4, , 5]);
                _c = (_b = UserModel_1.default).create;
                _g = {
                    Name: Name,
                    Email: Email
                };
                _e = (_d = bcrypt_1.default).hashSync;
                _f = [Password];
                return [4 /*yield*/, salt];
            case 2: return [4 /*yield*/, _c.apply(_b, [(_g.Password = _e.apply(_d, _f.concat([_h.sent()])),
                        _g.Bio = Bio,
                        _g.Image = Image,
                        _g.socialLinks = socialLinks,
                        _g)])];
            case 3:
                UserData = _h.sent();
                res.json({ UserData: UserData });
                return [3 /*break*/, 5];
            case 4:
                error_1 = _h.sent();
                console.log(error_1);
                res.status(400).json(error_1);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
Registration.put("/updateprofile/:userId", upload.single("Image"), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var newName, _a, originalname, path, parts, ext, file, writeStream_1, token;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (!req.file) return [3 /*break*/, 3];
                _a = req.file, originalname = _a.originalname, path = _a.path;
                parts = originalname.split(".");
                ext = parts[parts.length - 1];
                newName = "".concat(Date.now(), ".").concat(ext);
                file = Firebase_1.default.file("profile/".concat(newName));
                writeStream_1 = file.createWriteStream({
                    metadata: { contentType: req.file.mimetype },
                });
                fs_1.default.createReadStream(path).pipe(writeStream_1);
                return [4 /*yield*/, new Promise(function (resolve, reject) {
                        writeStream_1.on("error", reject);
                        writeStream_1.on("finish", resolve);
                    })];
            case 1:
                _b.sent();
                return [4 /*yield*/, file.makePublic()];
            case 2:
                _b.sent();
                // delete temporary file from local storage
                fs_1.default.unlinkSync(path);
                _b.label = 3;
            case 3:
                token = req.cookies.token;
                jsonwebtoken_1.default.verify(token, Secret, function (err, decoded) { return __awaiter(void 0, void 0, void 0, function () {
                    var userId, _a, Name, Bio, Social, decodedToken, info, user, isAuthor, previousImageName, previousImageFile, updatedUser, error_2;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                if (err)
                                    throw err;
                                userId = req.params.userId;
                                _a = req.body, Name = _a.Name, Bio = _a.Bio, Social = _a.Social;
                                decodedToken = typeof decoded === "string" ? JSON.parse(decoded) : decoded;
                                info = decodedToken.user;
                                _b.label = 1;
                            case 1:
                                _b.trys.push([1, 6, , 7]);
                                return [4 /*yield*/, UserModel_1.default.findById(userId)];
                            case 2:
                                user = _b.sent();
                                if (!user) {
                                    return [2 /*return*/, res.status(404).json({ message: "User not found" })];
                                }
                                isAuthor = JSON.stringify(user._id) === JSON.stringify(info.id);
                                if (!isAuthor) {
                                    return [2 /*return*/, res.status(400).json("You are not the author of this post")];
                                }
                                if (!(user.Image && user.Image !== defaultImageUrl)) return [3 /*break*/, 4];
                                previousImageName = user.Image.split("/").pop();
                                previousImageFile = Firebase_1.default.file("profile/".concat(previousImageName));
                                return [4 /*yield*/, previousImageFile.delete()];
                            case 3:
                                _b.sent();
                                _b.label = 4;
                            case 4:
                                // update user data
                                user.Name = Name || user.Name;
                                user.Bio = Bio || user.Bio;
                                user.socialLinks = Social ? JSON.parse(Social) : user.socialLinks;
                                user.Image = newName
                                    ? "https://storage.googleapis.com/".concat(Firebase_1.default.name, "/profile/").concat(newName)
                                    : user.Image;
                                return [4 /*yield*/, user.save()];
                            case 5:
                                updatedUser = _b.sent();
                                res.json(updatedUser);
                                return [3 /*break*/, 7];
                            case 6:
                                error_2 = _b.sent();
                                console.log(error_2);
                                res.status(400).json(error_2);
                                return [3 /*break*/, 7];
                            case 7: return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
        }
    });
}); });
exports.default = Registration;
