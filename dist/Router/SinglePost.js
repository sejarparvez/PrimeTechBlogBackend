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
var express_1 = __importDefault(require("express"));
var fs_1 = __importDefault(require("fs"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var multer_1 = __importDefault(require("multer"));
var Firebase_1 = __importDefault(require("../Firebase/Firebase"));
var PostModel_1 = __importDefault(require("../Model/PostModel"));
var SinglePost = express_1.default.Router();
var upload = (0, multer_1.default)({ dest: "uploads/" });
// CREATE A NEW POST
SinglePost.post("/newpost", upload.single("file"), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, originalname, path, parts, ext, newName, file, writeStream, token;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.file, originalname = _a.originalname, path = _a.path;
                parts = originalname.split(".");
                ext = parts[parts.length - 1];
                newName = "".concat(Date.now(), ".").concat(ext);
                file = Firebase_1.default.file(newName);
                writeStream = file.createWriteStream({
                    metadata: { contentType: req.file.mimetype },
                });
                fs_1.default.createReadStream(path).pipe(writeStream);
                return [4 /*yield*/, new Promise(function (resolve, reject) {
                        writeStream.on("error", reject);
                        writeStream.on("finish", resolve);
                    })];
            case 1:
                _b.sent();
                return [4 /*yield*/, file.makePublic()];
            case 2:
                _b.sent();
                // delete temporary file from local storage
                fs_1.default.unlinkSync(path);
                token = req.cookies.token;
                jsonwebtoken_1.default.verify(token, process.env.SECRET, {}, function (error, info) { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, title, summary, content, categories, PostData;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                if (error)
                                    throw error;
                                _a = req.body, title = _a.title, summary = _a.summary, content = _a.content, categories = _a.categories;
                                return [4 /*yield*/, PostModel_1.default.create({
                                        title: title,
                                        summary: summary,
                                        categories: categories,
                                        content: content,
                                        cover: "https://storage.googleapis.com/".concat(Firebase_1.default.name, "/").concat(newName),
                                        author: info.id,
                                    })];
                            case 1:
                                PostData = _b.sent();
                                res.json(PostData);
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
        }
    });
}); });
// ROUTER FOR UPLOADING POST IMAGE
SinglePost.post("/postimage", upload.single("file"), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, originalname, path, parts, ext, newName, file, writeStream_1, publicUrl, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = req.file, originalname = _a.originalname, path = _a.path;
                parts = originalname.split(".");
                ext = parts[parts.length - 1];
                newName = "".concat(Date.now(), ".").concat(ext);
                file = Firebase_1.default.file(newName);
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
                publicUrl = "https://storage.googleapis.com/".concat(Firebase_1.default.name, "/").concat(newName);
                res.send(publicUrl);
                return [3 /*break*/, 4];
            case 3:
                error_1 = _b.sent();
                console.error(error_1);
                res.status(500).send("Error uploading image");
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// UPDATE THE SINGLE POST
SinglePost.put("/post", upload.single("file"), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var newPath, _a, originalname, path, parts, ext, token;
    return __generator(this, function (_b) {
        newPath = null;
        if (req.file) {
            _a = req.file, originalname = _a.originalname, path = _a.path;
            parts = originalname.split(".");
            ext = parts[parts.length - 1];
            newPath = path + "." + ext;
            fs_1.default.renameSync(path, newPath);
        }
        token = req.cookies.token;
        jsonwebtoken_1.default.verify(token, process.env.SECRET, {}, function (error, info) { return __awaiter(void 0, void 0, void 0, function () {
            var _a, id, title, summary, content, categories, post, isAuthor, coverUrl, fileName, file, writeStream_2, oldFileName, oldFile;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (error)
                            throw error;
                        _a = req.body, id = _a.id, title = _a.title, summary = _a.summary, content = _a.content, categories = _a.categories;
                        return [4 /*yield*/, PostModel_1.default.findById(id)];
                    case 1:
                        post = _c.sent();
                        isAuthor = JSON.stringify(post.author) === JSON.stringify(info.id);
                        if (!isAuthor) {
                            return [2 /*return*/, res.status(400).json("You are not the author of this post")];
                        }
                        coverUrl = post.cover;
                        if (!newPath) return [3 /*break*/, 5];
                        fileName = "".concat(Date.now(), ".").concat(newPath.split(".").pop());
                        file = Firebase_1.default.file(fileName);
                        writeStream_2 = file.createWriteStream({
                            metadata: { contentType: (_b = req.file) === null || _b === void 0 ? void 0 : _b.mimetype },
                        });
                        fs_1.default.createReadStream(newPath).pipe(writeStream_2);
                        return [4 /*yield*/, new Promise(function (resolve, reject) {
                                writeStream_2.on("error", reject);
                                writeStream_2.on("finish", resolve);
                            })];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, file.makePublic()];
                    case 3:
                        _c.sent();
                        coverUrl = "https://storage.googleapis.com/".concat(Firebase_1.default.name, "/").concat(fileName);
                        // delete temporary file from local storage
                        fs_1.default.unlinkSync(newPath);
                        if (!post.cover) return [3 /*break*/, 5];
                        oldFileName = post.cover.split("/").pop();
                        oldFile = Firebase_1.default.file(oldFileName);
                        return [4 /*yield*/, oldFile.delete()];
                    case 4:
                        _c.sent();
                        _c.label = 5;
                    case 5: return [4 /*yield*/, post.update({
                            title: title,
                            summary: summary,
                            categories: categories,
                            content: content,
                            cover: coverUrl,
                        })];
                    case 6:
                        _c.sent();
                        res.json(post);
                        return [2 /*return*/];
                }
            });
        }); });
        return [2 /*return*/];
    });
}); });
// DELETE A POST
SinglePost.delete("/post/:id", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var postId, post, fileName, file, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                postId = req.params.id;
                return [4 /*yield*/, PostModel_1.default.findById(postId)];
            case 1:
                post = _a.sent();
                if (!post) {
                    return [2 /*return*/, res.status(404).json({ error: "Post not found" })];
                }
                fileName = post.cover.split("/").pop();
                file = Firebase_1.default.file(fileName);
                return [4 /*yield*/, file.delete()];
            case 2:
                _a.sent();
                // Delete the post from the database
                return [4 /*yield*/, PostModel_1.default.findByIdAndDelete(postId)];
            case 3:
                // Delete the post from the database
                _a.sent();
                return [2 /*return*/, res.status(200).json({ message: "Post deleted successfully" })];
            case 4:
                err_1 = _a.sent();
                console.error(err_1);
                return [2 /*return*/, res.status(500).json({ error: "Could not delete post" })];
            case 5: return [2 /*return*/];
        }
    });
}); });
exports.default = SinglePost;
