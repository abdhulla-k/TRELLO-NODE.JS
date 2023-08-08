import { NextFunction, Response } from "express";
import { ExpressRequestInterface } from "../types/expressRequest.interface";
import ColumnModel from '../models/column';
import { Server } from "socket.io";
import { Socket } from "../types/socket.interfact";
import { SocketEventsEnum } from "../types/socketEvents.enum";
import { getErrorMessage } from "../helper";

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

// Function to create columns
export const createColumn = async (
  io: Server,
  socket: Socket,
  data: any,
) => {
  try {
    // Make sure user data exist
    if (!socket.user) {
      socket.emit(
        SocketEventsEnum.columnsCreateFailure,
        'User is not authorized',
      )
      return;
    }

    // Create column object
    const newColumn = new ColumnModel({
      title: data.title,
      boardId: data.boardId,
      userId: data.userId,
    })

    // Save the document in db
    const savedData = await newColumn.save();

    // Emit to all users connected with the board
    io.to(data.boardId).emit(
      SocketEventsEnum.columnsCreateSuccess,
      savedData,
    )
  } catch (err) {
    // Emit a colum creation failed event
    socket.emit(
      SocketEventsEnum.columnsCreateFailure,
      getErrorMessage(err),
    );
  }
}