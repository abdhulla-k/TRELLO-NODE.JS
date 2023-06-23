/* eslint-disable @typescript-eslint/consistent-type-definitions */
import {type Request} from 'express';
import {type UserDocument} from './user.interface';

export interface ExpressRequestInterface extends Request {
	user: UserDocument;
}
