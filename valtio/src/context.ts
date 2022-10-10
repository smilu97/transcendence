import HttpConnector from './common/http-connector';
import { CommonServiceOptions } from './common/service';
import WsConnector from './common/ws-connector';

import { HttpWsAuthDao, MemoryAuthDao } from './auth/auth.dao';
import { HttpUserDao, MemoryUserDao } from './user/user.dao';
import { HttpWsChatDao, MemoryChatDao } from './chat/chat.dao';

import AuthService, { Auth, makeBearerAuth } from './auth';
import UserService from './user';
import ChatService from './chat';
import { MemoryPongServer } from './mock';
import { proxy } from 'valtio';

export interface SharedState {
  auth?: Auth;
}

const prevToken = localStorage.getItem('token');

const initialSharedState = {
  auth: prevToken ? makeBearerAuth(prevToken) : undefined,
};

export interface PongContext {
  readonly auth: AuthService;
  readonly user: UserService;
  readonly chat: ChatService;

  readonly shared: SharedState;
}

export interface HttpPongContextOptions {
  baseURL: string | URL;
  wsURL: string;
}

export class HttpPongContext implements PongContext {
  readonly auth: AuthService;
  readonly user: UserService;
  readonly chat: ChatService;

  readonly shared: SharedState;

  constructor(options: HttpPongContextOptions) {
    const { baseURL, wsURL } = options;

    this.shared = proxy(initialSharedState);

    const http = new HttpConnector(baseURL);
    const ws = new WsConnector(wsURL);

    const authDao = new HttpWsAuthDao(http, ws);
    const userDao = new HttpUserDao(http);
    const chatDao = new HttpWsChatDao(http, ws);

    const cso: CommonServiceOptions = { root: this };
    this.auth = new AuthService(cso, authDao);
    this.user = new UserService(cso, userDao);
    this.chat = new ChatService(cso, chatDao);
  }
}

export class MemoryPongContext implements PongContext {
  static defaultState: SharedState = { auth: undefined };

  readonly auth: AuthService;
  readonly user: UserService;
  readonly chat: ChatService;

  readonly shared: SharedState;

  constructor() {
    const mockServer = new MemoryPongServer();

    const authDao = new MemoryAuthDao(mockServer);
    const userDao = new MemoryUserDao(mockServer);
    const chatDao = new MemoryChatDao(mockServer);

    this.shared = proxy(initialSharedState);

    const cso: CommonServiceOptions = { root: this };
    this.auth = new AuthService(cso, authDao);
    this.user = new UserService(cso, userDao);
    this.chat = new ChatService(cso, chatDao);
  }
}
