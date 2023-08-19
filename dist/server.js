"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
// Import dotenv
require("dotenv/config");
// Import express
const express_1 = __importDefault(require("express"));
// Import createServer function from http module
const http_1 = require("http");
// Import Server from socket.io module
const socket_io_1 = require("socket.io");
// Import jwt
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Import mongodb
const mongoose_1 = __importDefault(require("mongoose"));
// Import body parser
const body_parser_1 = __importDefault(require("body-parser"));
// Import corse
const cors_1 = __importDefault(require("cors"));
// Import user model
const user_1 = __importDefault(require("./models/user"));
// Import path module
const path = require('path');
// Import controllers
const usersController = __importStar(require("./controllers/users"));
const authMiddleware = __importStar(require("./middlewares/auth"));
const boardsController = __importStar(require("./controllers/boards"));
const columnsController = __importStar(require("./controllers/columns"));
const tasksController = __importStar(require("./controllers/tasks"));
const socketEvents_enum_1 = require("./types/socketEvents.enum");
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: '*',
    },
});
// Set cross origin resorce sharing
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
// Define routes
// User register
app.post('/api/users', usersController.register);
// User login
app.post('/api/users/login', usersController.login);
// Get user details
app.get('/api/user', authMiddleware.verifyToken, usersController.currentUser);
// Get boards
app.get('/api/boards', authMiddleware.verifyToken, boardsController.getBoards);
// Get boards
app.get('/api/boards/:boardId', authMiddleware.verifyToken, boardsController.getBoard);
// Get columns of a specific board
app.get('/api/boards/:boardId/columns', authMiddleware.verifyToken, columnsController.getColumns);
// Get tasks of a specific board
app.get('/api/boards/:boardId/tasks', authMiddleware.verifyToken, tasksController.getTasks);
// Create new board
app.post('/api/boards', authMiddleware.verifyToken, boardsController.createBoard);
// Establish io connection
io.use((socket, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // Get token from hand shake
        const token = (_a = socket.handshake.auth.token) !== null && _a !== void 0 ? _a : "";
        // Make sure secret key provided in .env
        if (!process.env.SECRET_KEY) {
            return next(new Error('secret key missing'));
        }
        ;
        // Verify token and get user details
        const data = jsonwebtoken_1.default.verify(token.split(' ')[1], process.env.SECRET_KEY);
        // Get user details from db
        const user = yield user_1.default.findById(data.id);
        // Make sure a user exists with provided id
        if (!user) {
            return next(new Error('Authentication error'));
        }
        // Assign and save user details in socket object
        socket.user = user;
        // Go ahead
        next();
    }
    catch (_b) {
        next(new Error('Authentication error'));
    }
})).on('connection', (socket) => {
    // Event handler for join board (room)
    socket.on(socketEvents_enum_1.SocketEventsEnum.boardsJoin, (data) => {
        boardsController.joinBoard(io, socket, data);
    });
    // Event handler for leave board (room)
    socket.on(socketEvents_enum_1.SocketEventsEnum.boardsLeave, (data) => {
        boardsController.leaveBoard(io, socket, data);
    });
    // Event handler for create board
    socket.on(socketEvents_enum_1.SocketEventsEnum.columnsCreate, (data) => {
        columnsController.createColumn(io, socket, data);
    });
    // Event handler for create task
    socket.on(socketEvents_enum_1.SocketEventsEnum.tasksCreate, (data) => {
        tasksController.createTask(io, socket, data);
    });
    // Event handler to update board
    socket.on(socketEvents_enum_1.SocketEventsEnum.boardsUpdate, (data) => {
        boardsController.updateBoard(io, socket, data);
    });
    // Evnet handler to delete a board
    socket.on(socketEvents_enum_1.SocketEventsEnum.boardsDelete, (data) => {
        boardsController.deleteBoard(io, socket, data);
    });
    // Event handler to delete a column
    socket.on(socketEvents_enum_1.SocketEventsEnum.columnsDelete, (data) => {
        columnsController.deleteColumn(io, socket, data);
    });
    // Event handler for update column
    socket.on(socketEvents_enum_1.SocketEventsEnum.columnsUpdate, (data) => {
        columnsController.updateColumn(io, socket, data);
    });
    // Event handler for update task
    socket.on(socketEvents_enum_1.SocketEventsEnum.tasksUpdate, (data) => {
        tasksController.updateTask(io, socket, data);
    });
    // Event handler for delete task
    socket.on(socketEvents_enum_1.SocketEventsEnum.tasksDelete, (data) => {
        tasksController.deleteTask(io, socket, data);
    });
});
// Point static path to dist
app.use(express_1.default.static(path.join(__dirname, 'front')));
app.get('/', (req, res) => {
    res.sendFile('index.html');
});
// Connect with mongodb and make the application listenable
mongoose_1.default.connect(process.env.MONGODB_URL ? process.env.MONGODB_URL : '')
    .then(() => {
    console.log('connected mongodb');
    httpServer.listen(process.env.PORT ? process.env.PORT : 4000, () => {
        console.log(`app is running in port ${process.env.PORT ? process.env.PORT : 4000}`);
    });
})
    .catch(err => {
    console.log('error while connecting to mongodb');
});
//# sourceMappingURL=server.js.map