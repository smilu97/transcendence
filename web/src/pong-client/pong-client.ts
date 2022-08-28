import HttpConnector from './common/http-connector';
import { ProxyFn, CommonServiceOptions, SnapshotFn } from './common/service';
import WsConnector from './common/ws-connector';

import AuthDao from './auth/auth.dao';
import UserDao from './user/user.dao';
import ChatDao from './chat/chat.dao';

import AuthService from './auth';
import UserService from './user';
import ChatService from './chat';

export interface PongClientOptions {
  baseURL: string | URL;
  wsURL: string;
  proxyFn?: ProxyFn;
  snapshotFn?: SnapshotFn;
}

export class PongClient {
  auth: AuthService;
  user: UserService;
  chat: ChatService;

  constructor(options: PongClientOptions) {
    const { baseURL, wsURL, proxyFn, snapshotFn } = options;

    const http = new HttpConnector(baseURL);
    const ws = new WsConnector(wsURL);

    const authDao = new AuthDao(http, ws);
    const userDao = new UserDao(http);
    const chatDao = new ChatDao(http, ws);

    const cso: CommonServiceOptions = { root: this, proxyFn, snapshotFn };
    this.auth = new AuthService(cso, authDao);
    this.user = new UserService(cso, userDao);
    this.chat = new ChatService(cso, chatDao);

    http.setContextProvider(() => ({
      bearerToken: this.auth.state.token,
    }));

    ws.setTokenProvider(() => {
      const token = this.auth.state.token;
      return {
        content: token ? 'ALIVE' : 'NOT_AUTHED',
        token,
      };
    });

    ws.pulse();
    this.init();
  }

  private async init() {
    if (this.auth.state.token) {
      await this.user.updateProfile();
    }
  }
}
