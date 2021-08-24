import { Keyboard, KeyboardBuilder, MessageContext, MessageEventContext, VK } from "vk-io"
import { SessionManager } from "@vk-io/session"
import { HearManager } from "@vk-io/hear"
import { config } from "dotenv"

import * as commands from "./commands"
import * as event from "./eventHear"

config()
export const vk = new VK({
  token: process.env.TOKEN
})

const sessionManager = new SessionManager<MessageContext>()
const hearManager = new HearManager<MessageContext>()
const eventManager = new HearManager<MessageEventContext>()

vk.updates.use<MessageContext>(async (ctx, next) => {
  if (ctx.is(["message_new", "message_reply"])) {
    if (ctx.isGroup || ctx.isOutbox) return
  }
  await next()
})

const users: { id: number; counter: number }[] = []

vk.updates.on("message", sessionManager.middleware)
vk.updates.on("message", async (ctx, next) => {
  if (!ctx.session.user) {
    ctx.session.user = users.find(x => x.id === ctx.senderId)

    if (!ctx.session.user) {
      users.push({
        id: ctx.senderId,
        counter: 0
      })

      ctx.session.user = users[users.length - 1]
    }
  }

  ctx.session.user.counter += 1
  ctx.send(
    `
ID: ${ctx.session.user.id}
Counter: ${ctx.session.user.counter}`,
    { keyboard: Keyboard.builder() }
  )
})

vk.updates.on("message", hearManager.middleware)
vk.updates.on("message_event", eventManager.middleware)

Object.keys(commands).forEach(x => {
  const { hearConditions, handler }: commandTypes = commands[x]
  hearManager.hear(hearConditions, handler)
})

Object.keys(event).forEach(x => {
  const { hearConditions, handler }: eventTypes = event[x]
  eventManager.hear(hearConditions, handler)
})

vk.updates.start()

// setInterval(() => console.log(users), 20000)
