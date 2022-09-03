import { MemoryPongServer } from '../mock';
import HttpConnector from './http-connector';
import WsConnector from './ws-connector';

export type WsListener = (...args: any[]) => void;

export interface Dao {}

export abstract class MemoryDao implements Dao {
  constructor(protected server: MemoryPongServer) {}
}

export abstract class HttpDao implements Dao {
  constructor(protected readonly http: HttpConnector) {}
}

export abstract class WsDao implements Dao {
  constructor(protected readonly ws: WsConnector) {}

  protected on(event: string, listener: WsListener) {
    this.ws.on(event, listener);
  }
}

export abstract class HttpWsDao extends WsDao {
  constructor(protected readonly http: HttpConnector, ws: WsConnector) {
    super(ws);
  }
}
