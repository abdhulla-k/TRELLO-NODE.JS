import { NextFunction, Response } from "express";
import { ExpressRequestInterface } from "../types/expressRequest.interface";
import TaskModel from '../models/task';

export const getTasks = async (
  req: ExpressRequestInterface,
  res: Response,
  next: NextFunction,
) => {
  try {
    // Make sure user details exists in req
    if (!req.user) {
      return res.status(401);
    }

    // Get task array from db
    const tasks = await TaskModel.find({ boardId: req.params.boardId });

    // Send data to front end
    res.send(tasks);
  } catch (err) {
    next(err)
  }
}