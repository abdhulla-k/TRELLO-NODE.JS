import { NextFunction, Response } from "express";
import { ExpressRequestInterface } from "../types/expressRequest.interface";
import ColumnModel from '../models/column';

// Function to get all columns
export const getColumns = async (
  req: ExpressRequestInterface,
  res: Response,
  next: NextFunction
) => {
  try {
    // Make sure user details exist
    if (!req.user) {
      return res.status(401);
    }

    // Get column array from db
    const columns = await ColumnModel.find({
      boardId: req.params.boardId,
    });

    // Send data back
    res.send(columns);
  } catch (err) {
    next(err);
  }
}