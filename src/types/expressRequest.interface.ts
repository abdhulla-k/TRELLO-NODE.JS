/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable @typescript-eslint/consistent-type-definitions */
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { Request } from 'express';
import { UserDocument } from './user.interface';

export interface ExpressRequestInterface extends Request {
  user?: UserDocument;
}