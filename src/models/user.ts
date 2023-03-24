import mongoose from 'mongoose';
import type {UserDocument} from '../types/user.interface';
import validator from 'validator';

const userSchema = new mongoose.Schema<UserDocument>({
	email: {
		type: String,
		required: [true, 'Email is required'],
		validate: [validator.isEmail, 'invalid email'],
		createIndexes: {unique: true},
	},
	username: {
		type: String,
		required: [true, 'User name is required'],
	},
	password: {
		type: String,
		required: [true, 'Password is required'],
		select: false,
	},
}, {
	timestamps: true,
});

export default mongoose.model<UserDocument>('User', userSchema);
