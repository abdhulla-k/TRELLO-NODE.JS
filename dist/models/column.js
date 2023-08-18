"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const columnSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
    },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
    },
    boardId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
    },
});
exports.default = (0, mongoose_1.model)('Column', columnSchema);
//# sourceMappingURL=column.js.map