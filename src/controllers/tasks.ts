import { NextFunction, Response } from "express";
import { ExpressRequestInterface } from "../types/expressRequest.interface";
import TaskModel from '../models/task';
import { Server } from "socket.io";
import { Socket } from "../types/socket.interfact";
import { SocketEventsEnum } from "../types/socketEvents.enum";
import { getErrorMessage } from "../helper";

// Function to get all tasks
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

// Function to create columns
export const createTask = async (
  io: Server,
  socket: Socket,
  data: {
    title: string,
    boardId: string,
    columnId: string,
  },
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
    const newTask = new TaskModel({
      title: data.title,
      boardId: data.boardId,
      columnId: data.columnId,
      userId: socket.user.id,
    })

    // Save the document in db
    const savedData = await newTask.save();

    // Emit to all users connected with the board
    io.to(data.boardId).emit(
      SocketEventsEnum.tasksCreateSuccess,
      savedData,
    )
  } catch (err) {
    // Emit a colum creation failed event
    socket.emit(
      SocketEventsEnum.tasksCreateFailure,
      getErrorMessage(err),
    );
  }
}

export const updateTask = async (
  io: Server,
  socket: Socket,
  data: {
    boardId: string,
    taskId: string,
    fields: {
      title?: string;
      description?: string;
      columnId?: string
    }
  }
) => {
  try {
    // Make sure user authorized
    if (!socket.user) {
      socket.emit(
        SocketEventsEnum.tasksUpdateFailure,
        'User is not authorized',
      )
      return;
    }

    // Update column
    const updatedTask = await TaskModel.findByIdAndUpdate(
      data.taskId,
      data.fields,
      { new: true },
    )

    // Notify all users
    io.to(data.boardId).emit(
      SocketEventsEnum.tasksUpdateSuccess,
      updatedTask,
    )
  } catch (err) {
    // Send error response
    socket.emit(
      SocketEventsEnum.tasksUpdateFailure,
      getErrorMessage(err),
    )
  }
}