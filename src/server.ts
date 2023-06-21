// Import dotenv
import 'dotenv/config';
// Import express
import express from 'express';
// Import createServer function from http module
import {createServer} from 'http';
// Import Server from socket.io module
import {Server} from 'socket.io';
// Import mongodb
import mongoose from 'mongoose';
// Import body parser
import bodyParser from 'body-parser';

import * as usersController from './controllers/users';

const app = express();
const httpServer = createServer(app);
const io = new Server();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.get('/', (req, res, next) => {
	res.send('welcome to application');
});

app.post('/api/users', usersController.register);
app.post('/api/users/login', usersController.login);

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
