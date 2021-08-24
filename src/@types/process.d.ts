declare global {
  declare module "@types/node" {
    export namespace NodeJs {
      export interface ProcessEnv {
        TOKEN: string
      }
    }
  }
}
