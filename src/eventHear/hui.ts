export const Hui: eventTypes = {
  hearConditions: {
    eventPayload: "3"
  },
  handler: ctx => {
    ctx.answer({ type: "show_snackbar", text: "ты гей" })
  }
}
