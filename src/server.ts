// Import dotenv
import 'dotenv/config';

// Import express
import express from 'express';

// Import createServer function from http module
import { createServer } from 'http';

// Import Server from socket.io module
import { Server } from 'socket.io';

// Import jwt
import jwt from 'jsonwebtoken'

// Import mongodb
import mongoose from 'mongoose';

// Import body parser
import bodyParser from 'body-parser';

// Import corse
import cors from 'cors';

// Import user model
import User from './models/user';

// Import controllers
import * as usersController from './controllers/users';
import * as authMiddleware from './middlewares/auth';
import * as boardsController from './controllers/boards';
import * as columnsController from './controllers/columns';
import * as tasksController from './controllers/tasks';

import { SocketEventsEnum } from './types/socketEvents.enum';
import { Socket } from './types/socket.interfact';

const app = express();
const httpServer = createServer(app);
const io = new Server(
	httpServer,
	{
		cors: {
			origin: '*',
		},
	}
);

// Set cross origin resorce sharing
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.get('/', (req, res, next) => {
	res.send('welcome to application');
});

// Define routes
// User register
app.post('/api/users', usersController.register);

// User login
app.post('/api/users/login', usersController.login);

// Get user details
app.get(
	'/api/user',
	authMiddleware.verifyToken,
	usersController.currentUser,
);

// Get boards
app.get(
	'/api/boards',
	authMiddleware.verifyToken,
	boardsController.getBoards,
);

// Get boards
app.get(
	'/api/boards/:boardId',
	authMiddleware.verifyToken,
	boardsController.getBoard,
);

// Get columns of a specific board
app.get(
	'/api/boards/:boardId/columns',
	authMiddleware.verifyToken,
	columnsController.getColumns,
);

// Get tasks of a specific board
app.get(
	'/api/boards/:boardId/tasks',
	authMiddleware.verifyToken,
	tasksController.getTasks,
);

// Create new board
app.post(
	'/api/boards',
	authMiddleware.verifyToken,
	boardsController.createBoard,
);

// Establish io connection
io.use(async (socket: Socket, next) => {
	try {
		// Get token from hand shake
		const token = (socket.handshake.auth.token as string) ?? "";

		// Make sure secret key provided in .env
		if (!process.env.SECRET_KEY) {
			return next(new Error('secret key missing'))
		};

		// Verify token and get user details
		const data = jwt.verify(token.split(' ')[1], process.env.SECRET_KEY) as {
			id: string;
			email: string;
		}

		// Get user details from db
		const user = await User.findById(data.id);

		// Make sure a user exists with provided id
		if (!user) {
			return next(new Error('Authentication error'))
		}

		// Assign and save user details in socket object
		socket.user = user;

		// Go ahead
		next();
	} catch {
		next(new Error('Authentication error'));
	}
}).on('connection', (socket) => {
	// Event handler for join board (room)
	socket.on(
		SocketEventsEnum.boardsJoin,
		(data) => {
			boardsController.joinBoard(io, socket, data);
		}
	);

	// Event handler for leave board (room)
	socket.on(
		SocketEventsEnum.boardsLeave,
		(data) => {
			boardsController.leaveBoard(io, socket, data);
		}
	)

	// Event handler for create board
	socket.on(
		SocketEventsEnum.columnsCreate,
		(data) => {
			columnsController.createColumn(io, socket, data);
		}
	)

	// Event handler for create task
	socket.on(
		SocketEventsEnum.tasksCreate,
		(data) => {
			tasksController.createTask(
				io,
				socket,
				data,
			)
		}
	)

	// Event handler to update board
	socket.on(
		SocketEventsEnum.boardsUpdate,
		(data) => {
			boardsController.updateBoard(
				io,
				socket,
				data,
			)
		}
	)
});

// Connect with mongodb and make the application listenable
mongoose.connect(process.env.MONGODB_URL ? process.env.MONGODB_URL : '')
	.then(() => {
		console.log('connected mongodb');
		httpServer.listen(process.env.PORT ? process.env.PORT : 4000, () => {
			console.log(`app is running in port ${process.env.PORT ? process.env.PORT : 4000}`);
		});
	})
	.catch(err => {
		console.log('error while connecting to mongodb');
	});
