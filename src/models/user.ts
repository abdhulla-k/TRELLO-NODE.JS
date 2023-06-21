import mongoose from 'mongoose';
import type {UserDocument} from '../types/user.interface';
import validator from 'validator';
import bcryptjs from 'bcryptjs';

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

// Creating a function to execture before saving a document
// using 'pre' and 'save' to this
// The purpose is to hash the password
userSchema.pre('save', async function (next) {
	// Don't want to has if the password not modified
	if (!this.isModified('password')) {
		next();
		return;
	}

	try {
		// Generate salt
		const salt = await bcryptjs.genSalt(10);

		// Call hash function and hash the password
		this.password = await bcryptjs.hash(this.password, salt);

		// Call next to save the password
		next();
	} catch (err) {
		// eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
		return next(err as Error);
	}
});

// Create a functon to validate password when login in a user
userSchema.methods.validatePassword = async function (password: string) {
	// Compare using bcrypt module and return the value
	// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
	return bcryptjs.compare(password, this.password);
};

export default mongoose.model<UserDocument>('User', userSchema);
