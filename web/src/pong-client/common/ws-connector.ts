import { io } from 'socket.io-client';

export interface Health {
  content: string;
  token?: string;
}

export default class WsConnector {
  private readonly socket: ReturnType<typeof io>;

  private healthProvider?: () => Health;

  constructor(url: string) {
    this.socket = io(url);
    setInterval(() => this.pulse(), 3000);

    this.socket.on('connect', () => {
      this.pulse();
    });

    this.socket.on('disconnect', () => {
      console.log('disconnected');
    });
  }

  on(event: string, listener: (...args: any[]) => void) {
    this.socket.on(event, listener);
  }

  setTokenProvider(provider?: () => Health) {
    this.healthProvider = provider;
  }

  pulse() {
    if (this.healthProvider) {
      const health = this.healthProvider();
      if (health.token) {
        this.socket.emit('health', health);
      }
    }
  }
}
