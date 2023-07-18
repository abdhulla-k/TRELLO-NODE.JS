import { Request, Response, NextFunction } from "express";
import { ExpressRequestInterface } from "../types/expressRequest.interface";
import BoardModel from '../models/board';

export const getBoards = async (req: ExpressRequestInterface, res: Response, next: NextFunction) => {
  try {
    // Make sure user details exist in request
    if (!req.user) {
      throw res.sendStatus(401);
    }

    // Find board details
    const boards = await BoardModel.find({
      userId: req.user.id
    })

    // Return success response
    res.send(boards);
  } catch (err) {
    // Pass error to next function
    next(err);
  }
}
