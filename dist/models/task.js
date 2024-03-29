"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const taskSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
    },
    boardId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
    },
    columnId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
    },
}, {
    timestamps: true,
});
exports.default = (0, mongoose_1.model)('Task', taskSchema);
//# sourceMappingURL=task.js.map