/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/object-curly-spacing */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { Request, Response, NextFunction } from 'express';
import UserModel from '../models/user';
import type { UserDocument } from '../types/user.interface';
import { Error } from 'mongoose';
import jwt from 'jsonwebtoken';

const normalizeUser = function (user: UserDocument) {
	if (!process.env.SECRET_KEY) {
		throw new Error('SECRET_KEY environment variable is not defined.');
	}

	const token = jwt.sign(
		{
			id: user.id,
			email: user.email,
		},
		process.env.SECRET_KEY,
	);
	return {
		email: user.email,
		username: user.username,
		id: user.id,
		token,
	};
};

export const register = async (req: Request, res: Response, next: NextFunction) => {
	try {
		// Create module instance
		const newUser = new UserModel({
			email: req.body.email,
			username: req.body.username,
			password: req.body.password,
		});

		const newData = await newUser.save();
		res.send(normalizeUser(newData));
	} catch (err) {
		if (err instanceof Error.ValidationError) {
			const messages = Object.values(err.errors).map(err => err.message);
			return res.status(422).json(messages);
		}

		next(err);
	}
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const user = await UserModel.findOne({ email: req.body.email }).select('+password');
		const errors = { emailOrPassword: 'Incorrect email or password' };
		if (!user) {
			return res.status(422).json(errors);
		}

		const isSamePassword = await user.validatePassword(req?.body?.password);
		console.log(isSamePassword);
		if (!isSamePassword) {
			return res.status(422).json(errors);
		}

		res.send(normalizeUser(user));
	} catch (err) {
		if (err instanceof Error.ValidationError) {
			const messages = Object.values(err.errors).map(err => err.message);
			return res.status(422).json(messages);
		}

		next(err);
	}
};
