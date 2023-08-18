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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = __importDefault(require("../models/user"));
const verifyToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Take the token from headers and make sure user provided it
        const authHeader = String(req.headers.authorizations);
        if (!authHeader) {
            return res.sendStatus(401);
        }
        // Remove the extra added word Bearer
        const token = authHeader.split(' ')[1];
        // Assure existance of secret key and Get user details from token
        if (!process.env.SECRET_KEY) {
            return res.status(500);
        }
        const data = jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY);
        // Find user details from db and make sure the existance of user
        const user = yield user_1.default.findById(data.id);
        // Make sure user details exist and set that to request
        if (!user) {
            return res.sendStatus(401);
        }
        req.user = user;
        next();
    }
    catch (_a) {
        res.sendStatus(401);
    }
});
exports.verifyToken = verifyToken;
//# sourceMappingURL=auth.js.map