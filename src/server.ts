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

const app = express();
const httpServer = createServer(app);
const io = new Server();

app.get('/', (req, res, next) => {
	res.send('welcome to application');
});

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
