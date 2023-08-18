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
const mongoose_1 = __importDefault(require("mongoose"));
const validator_1 = __importDefault(require("validator"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const userSchema = new mongoose_1.default.Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        validate: [validator_1.default.isEmail, 'invalid email'],
        createIndexes: { unique: true },
    },
    username: {
        type: String,
        required: [true, 'User name is required'],
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        select: false,
    },
}, {
    timestamps: true,
});
// Creating a function to execture before saving a document
// using 'pre' and 'save' to this
// The purpose is to hash the password
userSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        // Don't want to has if the password not modified
        if (!this.isModified('password')) {
            next();
            return;
        }
        try {
            // Generate salt
            const salt = yield bcryptjs_1.default.genSalt(10);
            // Call hash function and hash the password
            this.password = yield bcryptjs_1.default.hash(this.password, salt);
            // Call next to save the password
            next();
        }
        catch (err) {
            return next(err);
        }
    });
});
// Create a functon to validate password when login in a user
userSchema.methods.validatePassword = function (password) {
    return __awaiter(this, void 0, void 0, function* () {
        // Compare using bcrypt module and return the value
        return bcryptjs_1.default.compare(password, this.password);
    });
};
exports.default = mongoose_1.default.model('User', userSchema);
//# sourceMappingURL=user.js.map