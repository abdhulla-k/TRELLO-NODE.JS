// Import dotenv
import 'dotenv/config';
// Import express
import express from 'express';
// Import createServer function from http module
import { createServer } from 'http';
// Import Server from socket.io module
import { Server } from 'socket.io';
// Import mongodb
import mongoose from 'mongoose';
// Import body parser
import bodyParser from 'body-parser';
// Import corse
import cors from 'cors';

// Import controllers
import * as usersController from './controllers/users';
import * as authMiddleware from './middlewares/auth';
import * as boardsController from './controllers/boards';

const app = express();
const httpServer = createServer(app);
const io = new Server();

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

// Create new board
app.post(
	'/api/boards',
	authMiddleware.verifyToken,
	boardsController.createBoard,
);

io.on('connection', () => {
	console.log('connected');
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
