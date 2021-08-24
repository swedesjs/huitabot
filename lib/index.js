"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.vk = void 0;
const vk_io_1 = require("vk-io");
const session_1 = require("@vk-io/session");
const hear_1 = require("@vk-io/hear");
const dotenv_1 = require("dotenv");
const commands = __importStar(require("./commands"));
const event = __importStar(require("./eventHear"));
dotenv_1.config();
exports.vk = new vk_io_1.VK({
    token: process.env.TOKEN
});
const sessionManager = new session_1.SessionManager();
const hearManager = new hear_1.HearManager();
const eventManager = new hear_1.HearManager();
exports.vk.updates.use(async (ctx, next) => {
    if (ctx.is(["message_new", "message_reply"])) {
        if (ctx.isGroup || ctx.isOutbox)
            return;
    }
    await next();
});
const users = [];
exports.vk.updates.on("message", sessionManager.middleware);
exports.vk.updates.on("message", async (ctx, next) => {
    if (!ctx.session.user) {
        ctx.session.user = users.find(x => x.id === ctx.senderId);
        if (!ctx.session.user) {
            users.push({
                id: ctx.senderId,
                counter: 0
            });
            ctx.session.user = users[users.length - 1];
        }
    }
    ctx.session.user.counter += 1;
    ctx.send(`
ID: ${ctx.session.user.id}
Counter: ${ctx.session.user.counter}`, { keyboard: vk_io_1.Keyboard.builder() });
});
exports.vk.updates.on("message", hearManager.middleware);
exports.vk.updates.on("message_event", eventManager.middleware);
Object.keys(commands).forEach(x => {
    const { hearConditions, handler } = commands[x];
    hearManager.hear(hearConditions, handler);
});
Object.keys(event).forEach(x => {
    const { hearConditions, handler } = event[x];
    eventManager.hear(hearConditions, handler);
});
exports.vk.updates.start();
// setInterval(() => console.log(users), 20000)
