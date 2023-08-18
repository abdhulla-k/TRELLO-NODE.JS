"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketEventsEnum = void 0;
var SocketEventsEnum;
(function (SocketEventsEnum) {
    // Board related events
    SocketEventsEnum["boardsJoin"] = "boards:join";
    SocketEventsEnum["boardsLeave"] = "boards:leave";
    SocketEventsEnum["boardsUpdate"] = "boards:update";
    SocketEventsEnum["boardsUpdateSuccess"] = "boards:updateeSuccess";
    SocketEventsEnum["boardsUpdateFailure"] = "boards:updateFailure";
    SocketEventsEnum["boardsDelete"] = "boards:delete";
    SocketEventsEnum["boardsDeleteSuccess"] = "boards:deleteeSuccess";
    SocketEventsEnum["boardsDeleteFailure"] = "boards:deleteFailure";
    // Column related evnets
    SocketEventsEnum["columnsCreate"] = "columns:create";
    SocketEventsEnum["columnsCreateSuccess"] = "columns:createSuccess";
    SocketEventsEnum["columnsCreateFailure"] = "columns:createFailure";
    SocketEventsEnum["columnsUpdate"] = "columns:update";
    SocketEventsEnum["columnsUpdateSuccess"] = "columns:updateeSuccess";
    SocketEventsEnum["columnsUpdateFailure"] = "columns:updateFailure";
    SocketEventsEnum["columnsDelete"] = "columns:delete";
    SocketEventsEnum["columnsDeleteSuccess"] = "columns:deleteeSuccess";
    SocketEventsEnum["columnsDeleteFailure"] = "columns:deleteFailure";
    // Task related events
    SocketEventsEnum["tasksCreate"] = "tasks:create";
    SocketEventsEnum["tasksCreateSuccess"] = "tasks:createSuccess";
    SocketEventsEnum["tasksCreateFailure"] = "tasks:createFailure";
    SocketEventsEnum["tasksUpdate"] = "tasks:update";
    SocketEventsEnum["tasksUpdateSuccess"] = "tasks:updateSuccess";
    SocketEventsEnum["tasksUpdateFailure"] = "tasks:updateFailure";
    SocketEventsEnum["tasksDelete"] = "tasks:delete";
    SocketEventsEnum["tasksDeleteSuccess"] = "tasks:deleteeSuccess";
    SocketEventsEnum["tasksDeleteFailure"] = "tasks:deleteFailure";
})(SocketEventsEnum = exports.SocketEventsEnum || (exports.SocketEventsEnum = {}));
//# sourceMappingURL=socketEvents.enum.js.map