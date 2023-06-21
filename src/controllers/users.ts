/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/object-curly-spacing */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { Request, Response, NextFunction } from 'express';
import UserModel from '../models/user';
import type { UserDocument } from '../types/user.interface';
import { Error } from 'mongoose';
import jwt from 'jsonwebtoken';

// Function to normalize user details. only give required data to front end
const normalizeUser = function (user: UserDocument) {
	// Make sure secret key not undefined in environment variables
	if (!process.env.SECRET_KEY) {
		throw new Error('SECRET_KEY environment variable is not defined.');
	}

	// Create jwt token with user email and user id
	const token = jwt.sign(
		{
			id: user.id,
			email: user.email,
		},
		process.env.SECRET_KEY,
	);

	// Return normalized data
	return {
		email: user.email,
		username: user.username,
		id: user.id,
		token,
	};
};

// Function to Register for a user
export const register = async (req: Request, res: Response, next: NextFunction) => {
	try {
		// Create model instance
		const newUser = new UserModel({
			email: req.body.email,
			username: req.body.username,
			password: req.body.password,
		});

		// Save the data
		const newData = await newUser.save();

		// Send normalized data to user
		res.send(normalizeUser(newData));
	} catch (err) {
		// Send an error response if there any errors
		if (err instanceof Error.ValidationError) {
			const messages = Object.values(err.errors).map(err => err.message);
			return res.status(422).json(messages);
		}

		next(err);
	}
};

// Function to login
export const login = async (req: Request, res: Response, next: NextFunction) => {
	try {
		// Find user with email and get password with that. => we sat select: false
		const user = await UserModel.findOne({ email: req.body.email }).select('+password');
		const errors = { emailOrPassword: 'Incorrect email or password' };

		// Rturn an error if user not exist with given email
		if (!user) {
			return res.status(422).json(errors);
		}

		// Make sure given password is correct through passing to validatePassword function that we created in model
		const isSamePassword = await user.validatePassword(req?.body?.password);

		// Return error if password wrong
		if (!isSamePassword) {
			return res.status(422).json(errors);
		}

		// Send normalized user details.
		res.send(normalizeUser(user));
	} catch (err) {
		// Send an error response if there is any error
		if (err instanceof Error.ValidationError) {
			const messages = Object.values(err.errors).map(err => err.message);
			return res.status(422).json(messages);
		}

		next(err);
	}
};
