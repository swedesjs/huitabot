"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hui = void 0;
exports.Hui = {
    hearConditions: {
        eventPayload: "3"
    },
    handler: ctx => {
        ctx.answer({ type: "show_snackbar", text: "ты гей" });
    }
};
