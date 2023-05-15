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
var PostModel_1 = __importDefault(require("../Model/PostModel"));
var Article = express_1.default.Router();
// RENDER ALL POST
Article.get("/post", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, page, _c, pageSize, count, totalPages, posts, err_1;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _a = req.query, _b = _a.page, page = _b === void 0 ? 1 : _b, _c = _a.pageSize, pageSize = _c === void 0 ? 10 : _c;
                _d.label = 1;
            case 1:
                _d.trys.push([1, 4, , 5]);
                return [4 /*yield*/, PostModel_1.default.countDocuments()];
            case 2:
                count = _d.sent();
                totalPages = Math.ceil(count / Number(pageSize));
                return [4 /*yield*/, PostModel_1.default.find()
                        .populate("author", ["Name"])
                        .sort({ createdAt: -1 })
                        .skip((Number(page) - 1) * Number(pageSize))
                        .limit(Number(pageSize))];
            case 3:
                posts = _d.sent();
                res.json({ posts: posts, totalPages: totalPages });
                return [3 /*break*/, 5];
            case 4:
                err_1 = _d.sent();
                res.status(500).json({ message: err_1.message });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
// RENDER ALL POST OF A SINGLE USER
Article.get("/post/users/:id", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, _a, _b, page, _c, pageSize, count, totalPages, posts, err_2;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                id = req.params.id;
                _a = req.query, _b = _a.page, page = _b === void 0 ? 1 : _b, _c = _a.pageSize, pageSize = _c === void 0 ? 10 : _c;
                _d.label = 1;
            case 1:
                _d.trys.push([1, 4, , 5]);
                return [4 /*yield*/, PostModel_1.default.countDocuments({ author: id })];
            case 2:
                count = _d.sent();
                totalPages = Math.ceil(count / Number(pageSize));
                return [4 /*yield*/, PostModel_1.default.find({ author: id })
                        .populate("author", ["Name"])
                        .sort({ createdAt: -1 })
                        .skip((Number(page) - 1) * Number(pageSize))
                        .limit(Number(pageSize))];
            case 3:
                posts = _d.sent();
                res.json({ posts: posts, totalPages: totalPages });
                return [3 /*break*/, 5];
            case 4:
                err_2 = _d.sent();
                res.status(500).json({ message: err_2.message });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
// RENDER A SINGLE POST
Article.get("/post/:id", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, PostData;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.params.id;
                return [4 /*yield*/, PostModel_1.default.findById(id).populate("author", [
                        "Name",
                        "Email",
                        "Bio",
                        "Image",
                        "socialLinks",
                    ])];
            case 1:
                PostData = _a.sent();
                res.json(PostData);
                return [2 /*return*/];
        }
    });
}); });
// RENDER THE FEATURED POST
Article.get("/posts/featured", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var post, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, PostModel_1.default.findOne({ categories: "featured" })
                        .populate("author", ["Name"])
                        .sort({ updatedAt: -1 })];
            case 1:
                post = _a.sent();
                if (!post) {
                    return [2 /*return*/, res.status(404).json({ message: "Post not found" })];
                }
                return [2 /*return*/, res.json(post)];
            case 2:
                error_1 = _a.sent();
                console.error(error_1);
                return [2 /*return*/, res.status(500).json({ message: "Server error" })];
            case 3: return [2 /*return*/];
        }
    });
}); });
// RENDER ALL HOT POST
Article.get("/posts/hotpost", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var posts, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, PostModel_1.default.find({ categories: "hotpost" })
                        .populate("author", ["Name"])
                        .sort({ updatedAt: -1 })
                        .limit(3)];
            case 1:
                posts = _a.sent();
                if (posts.length === 0) {
                    return [2 /*return*/, res.status(404).json({ message: "No Post To Display" })];
                }
                return [2 /*return*/, res.json(posts)];
            case 2:
                error_2 = _a.sent();
                console.error(error_2);
                return [2 /*return*/, res.status(500).json({ message: "Server error" })];
            case 3: return [2 /*return*/];
        }
    });
}); });
// RENDER ALL POST OF A SINGLE CATEGORIES
Article.get("/categoriesposts/:category", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, page, _c, pageSize, category, count, totalPages, posts, err_3;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _a = req.query, _b = _a.page, page = _b === void 0 ? 1 : _b, _c = _a.pageSize, pageSize = _c === void 0 ? 10 : _c;
                category = req.params.category;
                _d.label = 1;
            case 1:
                _d.trys.push([1, 4, , 5]);
                return [4 /*yield*/, PostModel_1.default.countDocuments({ categories: category })];
            case 2:
                count = _d.sent();
                totalPages = Math.ceil(count / Number(pageSize));
                return [4 /*yield*/, PostModel_1.default.find({ categories: category })
                        .populate("author", ["Name"])
                        .sort({ createdAt: -1 })
                        .skip((Number(page) - 1) * Number(pageSize))
                        .limit(Number(pageSize))];
            case 3:
                posts = _d.sent();
                res.json({ posts: posts, totalPages: totalPages });
                return [3 /*break*/, 5];
            case 4:
                err_3 = _d.sent();
                res.status(500).json({ message: err_3.message });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
exports.default = Article;
