"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getErrorMessage = void 0;
// Function to convert error to string
const getErrorMessage = (err) => {
    // Set error message here
    const errorMessage = err instanceof Error ? err.message : String(err);
    // Return it
    return errorMessage;
};
exports.getErrorMessage = getErrorMessage;
//# sourceMappingURL=helper.js.map