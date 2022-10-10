import { io } from 'socket.io-client';

export interface Health {
  content: string;
  token?: string;
}

export default class WsConnector {
  private readonly socket: ReturnType<typeof io>;

  constructor(url: string) {
    this.socket = io(url);
  }

  on(event: string, listener: (...args: any[]) => void) {
    this.socket.on(event, listener);
  }

  pulse(token: string) {
    this.socket.emit('health', { token });
  }
}
