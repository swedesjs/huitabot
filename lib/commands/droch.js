"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Droch = void 0;
const vk_io_1 = require("vk-io");
exports.Droch = {
    hearConditions: /^(?:дрочить)$/i,
    handler: ctx => {
        ctx.send(`1`, {
            keyboard: vk_io_1.Keyboard.builder()
                .callbackButton({
                label: "3",
                payload: "3"
            })
                .inline()
        });
    }
};
