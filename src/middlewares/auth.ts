import { type NextFunction, type Response } from 'express';
import jwt from 'jsonwebtoken';
import UserModel from '../models/user';
import { ExpressRequestInterface } from '../types/expressRequest.interface';



export const verifyToken = async (req: ExpressRequestInterface, res: Response, next: NextFunction) => {
	try {
		// Take the token from headers and make sure user provided it
		const authHeader = String(req.headers.authorizations);

		if (!authHeader) {
			return res.sendStatus(401);
		}

		// Remove the extra added word Bearer
		const token = authHeader.split(' ')[1];

		// Assure existance of secret key and Get user details from token
		if (!process.env.SECRET_KEY) {
			return res.status(500);
		}

		const data = jwt.verify(token, process.env.SECRET_KEY) as { id: string; email: string };

		// Find user details from db and make sure the existance of user
		const user = await UserModel.findById(data.id);

		// Make sure user details exist and set that to request
		if (!user) {
			return res.sendStatus(401);
		}

		req.user = user;
		next();
	} catch {
		res.sendStatus(401);
	}
};
