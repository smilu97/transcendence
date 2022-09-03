export interface PongEnvs {
  contextType: 'http' | 'memory';
  httpURL?: string;
  wsURL?: string;
}

const configs: PongEnvs = {
  contextType: import.meta.env.VITE_PONG_CLIENT_TYPE || 'memory',
  httpURL: import.meta.env.VITE_PONG_URL || 'http://127.0.0.1:3000',
  wsURL: import.meta.env.VITE_PONG_WS_URL || 'http://[::1]:3002',
};

export default configs;
