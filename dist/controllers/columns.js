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
exports.updateColumn = exports.deleteColumn = exports.createColumn = exports.getColumns = void 0;
const column_1 = __importDefault(require("../models/column"));
const socketEvents_enum_1 = require("../types/socketEvents.enum");
const helper_1 = require("../helper");
// Function to get all columns
const getColumns = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Make sure user details exist
        if (!req.user) {
            return res.status(401);
        }
        // Get column array from db
        const columns = yield column_1.default.find({
            boardId: req.params.boardId,
        });
        // Send data back
        res.send(columns);
    }
    catch (err) {
        next(err);
    }
});
exports.getColumns = getColumns;
// Function to create columns
const createColumn = (io, socket, data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Make sure user data exist
        if (!socket.user) {
            socket.emit(socketEvents_enum_1.SocketEventsEnum.columnsCreateFailure, 'User is not authorized');
            return;
        }
        // Create column object
        const newColumn = new column_1.default({
            title: data.title,
            boardId: data.boardId,
            userId: socket.user.id,
        });
        // Save the document in db
        const savedData = yield newColumn.save();
        // Emit to all users connected with the board
        io.to(data.boardId).emit(socketEvents_enum_1.SocketEventsEnum.columnsCreateSuccess, savedData);
    }
    catch (err) {
        // Emit a colum creation failed event
        socket.emit(socketEvents_enum_1.SocketEventsEnum.columnsCreateFailure, (0, helper_1.getErrorMessage)(err));
    }
});
exports.createColumn = createColumn;
const deleteColumn = (io, socket, data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Make sure user authorized
        if (!socket.user) {
            socket.emit(socketEvents_enum_1.SocketEventsEnum.columnsDeleteFailure, 'User is not authorized');
            return;
        }
        // Delete the column
        yield column_1.default.findByIdAndDelete(data.columnId);
        // notify all users
        io.to(data.boardId).emit(socketEvents_enum_1.SocketEventsEnum.columnsDeleteSuccess, data.columnId);
    }
    catch (err) {
        // Send error message
        socket.emit(socketEvents_enum_1.SocketEventsEnum.columnsDeleteFailure, (0, helper_1.getErrorMessage)(err));
    }
});
exports.deleteColumn = deleteColumn;
const updateColumn = (io, socket, data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Make sure user authorized
        if (!socket.user) {
            socket.emit(socketEvents_enum_1.SocketEventsEnum.columnsUpdateFailure, 'User is not authorized');
            return;
        }
        // Update column
        const updateColumn = yield column_1.default.findByIdAndUpdate(data.columnId, data.fields, { new: true });
        // Notify all users
        io.to(data.boardId).emit(socketEvents_enum_1.SocketEventsEnum.columnsUpdateSuccess, updateColumn);
    }
    catch (err) {
        // Send error response
        socket.emit(socketEvents_enum_1.SocketEventsEnum.columnsUpdateFailure, (0, helper_1.getErrorMessage)(err));
    }
});
exports.updateColumn = updateColumn;
//# sourceMappingURL=columns.js.map