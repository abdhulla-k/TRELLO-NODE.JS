export enum SocketEventsEnum {
  boardsJoin = 'boards:join',
  boardsLeave = 'boards:leave',
  boardsUpdate = 'boards:update',
  boardsUpdateSuccess = 'boards:updateeSuccess',
  boardsUpdateFailure = 'boards:updateFailure',
  columnsCreate = 'columns:create',
  columnsCreateSuccess = 'columns:createSuccess',
  columnsCreateFailure = 'columns:createFailure',
  tasksCreate = 'tasks:create',
  tasksCreateSuccess = 'tasks:createSuccess',
  tasksCreateFailure = 'tasks:createFailure',
}