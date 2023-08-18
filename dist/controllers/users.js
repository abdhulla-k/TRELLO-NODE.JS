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
exports.currentUser = exports.login = exports.register = void 0;
const user_1 = __importDefault(require("../models/user"));
const mongoose_1 = require("mongoose");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Function to normalize user details. only give required data to front end
const normalizeUser = function (user) {
    // Make sure secret key not undefined in environment variables
    if (!process.env.SECRET_KEY) {
        throw new mongoose_1.Error('SECRET_KEY environment variable is not defined.');
    }
    // Create jwt token with user email and user id
    const token = jsonwebtoken_1.default.sign({
        id: user.id,
        email: user.email,
    }, process.env.SECRET_KEY);
    // Return normalized data
    return {
        email: user.email,
        username: user.username,
        id: user.id,
        token: `Bearer ${token}`,
    };
};
// Function to Register for a user
const register = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Create model instance
        const newUser = new user_1.default({
            email: req.body.email,
            username: req.body.username,
            password: req.body.password,
        });
        // Save the data
        const newData = yield newUser.save();
        // Send normalized data to user
        res.send(normalizeUser(newData));
    }
    catch (err) {
        // Send an error response if there any errors
        if (err instanceof mongoose_1.Error.ValidationError) {
            const messages = Object.values(err.errors).map(err => err.message);
            return res.status(422).json(messages);
        }
        next(err);
    }
});
exports.register = register;
// Function to login
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // Find user with email and get password with that. => we sat select: false
        const user = yield user_1.default.findOne({ email: req.body.email }).select('+password');
        const errors = { emailOrPassword: 'Incorrect email or password' };
        // Rturn an error if user not exist with given email
        if (!user) {
            return res.status(422).json(errors);
        }
        // Make sure given password is correct through passing to validatePassword function that we created in model
        const isSamePassword = yield user.validatePassword((_a = req === null || req === void 0 ? void 0 : req.body) === null || _a === void 0 ? void 0 : _a.password);
        // Return error if password wrong
        if (!isSamePassword) {
            return res.status(422).json(errors);
        }
        // Send normalized user details.
        res.send(normalizeUser(user));
    }
    catch (err) {
        // Send an error response if there is any error
        if (err instanceof mongoose_1.Error.ValidationError) {
            const messages = Object.values(err.errors).map(err => err.message);
            return res.status(422).json(messages);
        }
        next(err);
    }
});
exports.login = login;
// Function to get current or login user details
const currentUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user)
        return res.sendStatus(401);
    // Take user details from reques object and return it
    res.send(normalizeUser(req.user));
});
exports.currentUser = currentUser;
//# sourceMappingURL=users.js.map