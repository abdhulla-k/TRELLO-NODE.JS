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
exports.deleteTask = exports.updateTask = exports.createTask = exports.getTasks = void 0;
const task_1 = __importDefault(require("../models/task"));
const socketEvents_enum_1 = require("../types/socketEvents.enum");
const helper_1 = require("../helper");
// Function to get all tasks
const getTasks = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Make sure user details exists in req
        if (!req.user) {
            return res.status(401);
        }
        // Get task array from db
        const tasks = yield task_1.default.find({ boardId: req.params.boardId });
        // Send data to front end
        res.send(tasks);
    }
    catch (err) {
        next(err);
    }
});
exports.getTasks = getTasks;
// Function to create columns
const createTask = (io, socket, data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Make sure user data exist
        if (!socket.user) {
            socket.emit(socketEvents_enum_1.SocketEventsEnum.columnsCreateFailure, 'User is not authorized');
            return;
        }
        // Create column object
        const newTask = new task_1.default({
            title: data.title,
            boardId: data.boardId,
            columnId: data.columnId,
            userId: socket.user.id,
        });
        // Save the document in db
        const savedData = yield newTask.save();
        // Emit to all users connected with the board
        io.to(data.boardId).emit(socketEvents_enum_1.SocketEventsEnum.tasksCreateSuccess, savedData);
    }
    catch (err) {
        // Emit a colum creation failed event
        socket.emit(socketEvents_enum_1.SocketEventsEnum.tasksCreateFailure, (0, helper_1.getErrorMessage)(err));
    }
});
exports.createTask = createTask;
const updateTask = (io, socket, data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Make sure user authorized
        if (!socket.user) {
            socket.emit(socketEvents_enum_1.SocketEventsEnum.tasksUpdateFailure, 'User is not authorized');
            return;
        }
        // Update column
        const updatedTask = yield task_1.default.findByIdAndUpdate(data.taskId, data.fields, { new: true });
        // Notify all users
        io.to(data.boardId).emit(socketEvents_enum_1.SocketEventsEnum.tasksUpdateSuccess, updatedTask);
    }
    catch (err) {
        // Send error response
        socket.emit(socketEvents_enum_1.SocketEventsEnum.tasksUpdateFailure, (0, helper_1.getErrorMessage)(err));
    }
});
exports.updateTask = updateTask;
const deleteTask = (io, socket, data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Make sure user authorized
        if (!socket.user) {
            socket.emit(socketEvents_enum_1.SocketEventsEnum.tasksDeleteFailure, 'User is not authorized');
            return;
        }
        // Delete task
        const updatedTask = yield task_1.default.findByIdAndDelete(data.taskId);
        // Notify all users
        io.to(data.boardId).emit(socketEvents_enum_1.SocketEventsEnum.tasksDeleteSuccess, data.taskId);
    }
    catch (err) {
        // Send error response
        socket.emit(socketEvents_enum_1.SocketEventsEnum.tasksUpdateFailure, (0, helper_1.getErrorMessage)(err));
    }
});
exports.deleteTask = deleteTask;
//# sourceMappingURL=tasks.js.map