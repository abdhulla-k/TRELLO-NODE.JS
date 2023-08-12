import { Response, NextFunction } from "express";
import { ExpressRequestInterface } from "../types/expressRequest.interface";
import BoardModel from '../models/board';
import { Server } from "socket.io";
import { Socket } from '../types/socket.interfact';
import { SocketEventsEnum } from "../types/socketEvents.enum";
import { getErrorMessage } from "../helper";

// Function to get all boards. (boards list)
export const getBoards = async (
  req: ExpressRequestInterface,
  res: Response,
  next: NextFunction
) => {
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

// Function to created new board
export const createBoard = async (
  req: ExpressRequestInterface,
  res: Response,
  next: NextFunction
) => {
  try {
    // Make sure user details exist in request
    if (!req.user) {
      throw res.sendStatus(401);
    }

    // Create new object of BoardModel
    const newBoard = new BoardModel({
      title: req.body.title,
      userId: req.user.id,
    })

    // Save new data
    const savedBoard = await newBoard.save();

    // Return new board to front end
    res.send(savedBoard);
  } catch (err) {
    // Handle errors
    next(err)
  }
}

// Function to get details of a single board
export const getBoard = async (
  req: ExpressRequestInterface,
  res: Response,
  next: NextFunction,
) => {
  try {
    // Make sure user logged in
    if (!req.user) {
      throw res.sendStatus(401);
    }

    // Make sure board id provided
    if (!req.params['boardId']) throw new Error('board not missing');

    // Get board id
    const boardId = req.params['boardId'];

    // Get board details
    const board = await BoardModel.findById(boardId);

    // Send data back
    res.send(board);
  } catch (err) {
    // Handle error
    next(err)
  }
}

// Function to join into a socket room
export const joinBoard = async (
  io: Server,
  socket: Socket,
  data: { boardId: string },
) => {
  // Join to room. (room's name is boardId. it is unique id from mongodb)
  socket.join(data.boardId);
}

// Function to leave a board
export const leaveBoard = async (
  io: Server,
  socket: Socket,
  data: { boardId: string },
) => {
  // Leave from board (socket room)
  socket.leave(data.boardId);
}

export const updateBoard = async (
  io: Server,
  socket: Socket,
  data: {
    boardId: string,
    fields: {
      title: string,
    },
  },
) => {
  try {
    // Make sure user details exists
    if (!socket.user) {
      socket.emit(
        SocketEventsEnum.boardsUpdateFailure,
        'User is not authorized'
      )
      return;
    }

    // Update board details
    const updatedBoard = await BoardModel.findByIdAndUpdate(
      data.boardId,
      data.fields,
      { new: true },
    )

    // Emit success event
    io.to(data.boardId).emit(
      SocketEventsEnum.boardsUpdateSuccess,
      updatedBoard,
    )
  } catch (err) {
    socket.emit(
      SocketEventsEnum.boardsUpdateFailure,
      getErrorMessage(err),
    )
  }
}
