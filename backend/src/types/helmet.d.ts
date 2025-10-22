declare module 'helmet' {
  import { RequestHandler } from 'express';

  interface HelmetOptions {
    // Du kan lägga till de options du använder, eller lämna tomt
    [key: string]: any;
  }

  function helmet(options?: HelmetOptions): RequestHandler;

  export default helmet;
}
