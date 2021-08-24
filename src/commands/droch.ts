import { Keyboard } from "vk-io"

export const Droch: commandTypes = {
  hearConditions: /^(?:дрочить)$/i,
  handler: ctx => {
    ctx.send(`1`, {
      keyboard: Keyboard.builder()
        .callbackButton({
          label: "3",
          payload: "3"
        })
        .inline()
    })
  }
}
