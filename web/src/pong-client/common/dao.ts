import HttpConnector from './http-connector';
import WsConnector from './ws-connector';

export interface Dao {}

export abstract class HttpDao implements Dao {
  constructor(protected readonly http: HttpConnector) {}
}

export abstract class WsDao implements Dao {
  constructor(protected readonly ws: WsConnector) {}

  on(event: string, listener: (...args: any[]) => void) {
    this.ws.on(event, listener);
  }
}

export abstract class HttpWsDao extends WsDao {
  constructor(protected readonly http: HttpConnector, ws: WsConnector) {
    super(ws);
  }
}
