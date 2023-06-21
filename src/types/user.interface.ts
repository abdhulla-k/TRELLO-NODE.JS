import type {Document} from 'mongoose';

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export interface User {
	email: string;
	username: string;
	password: string;
	createdAt: Date;
}

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export interface UserDocument extends User, Document {
	validatePassword(param1: string): Promise<boolean>;
}
