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
exports.deleteBoard = exports.updateBoard = exports.leaveBoard = exports.joinBoard = exports.getBoard = exports.createBoard = exports.getBoards = void 0;
const board_1 = __importDefault(require("../models/board"));
const socketEvents_enum_1 = require("../types/socketEvents.enum");
const helper_1 = require("../helper");
// Function to get all boards. (boards list)
const getBoards = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Make sure user details exist in request
        if (!req.user) {
            throw res.sendStatus(401);
        }
        // Find board details
        const boards = yield board_1.default.find({
            userId: req.user.id
        });
        // Return success response
        res.send(boards);
    }
    catch (err) {
        // Pass error to next function
        next(err);
    }
});
exports.getBoards = getBoards;
// Function to created new board
const createBoard = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Make sure user details exist in request
        if (!req.user) {
            throw res.sendStatus(401);
        }
        // Create new object of BoardModel
        const newBoard = new board_1.default({
            title: req.body.title,
            userId: req.user.id,
        });
        // Save new data
        const savedBoard = yield newBoard.save();
        // Return new board to front end
        res.send(savedBoard);
    }
    catch (err) {
        // Handle errors
        next(err);
    }
});
exports.createBoard = createBoard;
// Function to get details of a single board
const getBoard = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Make sure user logged in
        if (!req.user) {
            throw res.sendStatus(401);
        }
        // Make sure board id provided
        if (!req.params['boardId'])
            throw new Error('board not missing');
        // Get board id
        const boardId = req.params['boardId'];
        // Get board details
        const board = yield board_1.default.findById(boardId);
        // Send data back
        res.send(board);
    }
    catch (err) {
        // Handle error
        next(err);
    }
});
exports.getBoard = getBoard;
// Function to join into a socket room
const joinBoard = (io, socket, data) => __awaiter(void 0, void 0, void 0, function* () {
    // Join to room. (room's name is boardId. it is unique id from mongodb)
    socket.join(data.boardId);
});
exports.joinBoard = joinBoard;
// Function to leave a board
const leaveBoard = (io, socket, data) => __awaiter(void 0, void 0, void 0, function* () {
    // Leave from board (socket room)
    socket.leave(data.boardId);
});
exports.leaveBoard = leaveBoard;
const updateBoard = (io, socket, data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Make sure user details exists
        if (!socket.user) {
            socket.emit(socketEvents_enum_1.SocketEventsEnum.boardsUpdateFailure, 'User is not authorized');
            return;
        }
        // Update board details
        const updatedBoard = yield board_1.default.findByIdAndUpdate(data.boardId, data.fields, { new: true });
        // Emit success event
        io.to(data.boardId).emit(socketEvents_enum_1.SocketEventsEnum.boardsUpdateSuccess, updatedBoard);
    }
    catch (err) {
        socket.emit(socketEvents_enum_1.SocketEventsEnum.boardsUpdateFailure, (0, helper_1.getErrorMessage)(err));
    }
});
exports.updateBoard = updateBoard;
const deleteBoard = (io, socket, data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Make sure user authorized
        if (!socket.user) {
            socket.emit(socketEvents_enum_1.SocketEventsEnum.boardsDeleteFailure, 'User is not authorized');
            return;
        }
        // Delete user
        yield board_1.default.findByIdAndDelete(data.boardId);
        // Notify success
        io.to(data.boardId).emit(socketEvents_enum_1.SocketEventsEnum.boardsDeleteSuccess);
    }
    catch (err) {
        // Notify failure
        socket.emit(socketEvents_enum_1.SocketEventsEnum.boardsDeleteFailure, (0, helper_1.getErrorMessage)(err));
    }
});
exports.deleteBoard = deleteBoard;
//# sourceMappingURL=boards.js.map