import { HttpPongContext, MemoryPongContext, PongContext } from './context';

export type PongReactOptions = HttpPongReactOptions | MemoryPongReactOptions;

export type HttpPongReactOptions = {
  contextType: 'http';
  httpURL: string;
  wsURL: string;
};

export type MemoryPongReactOptions = {
  contextType: 'memory';
};

export function createPongContext(options: PongReactOptions): PongContext {
  if (options.contextType === 'http') {
    return createHttpPongContext(options);
  } else {
    return createMemoryPongContext();
  }
}

function createHttpPongContext(options: HttpPongReactOptions): HttpPongContext {
  const { httpURL, wsURL } = options;

  if (httpURL === undefined || wsURL === undefined) {
    throw new Error('httpURL, wsURL must be providen for http-context');
  }

  return new HttpPongContext({ baseURL: httpURL, wsURL });
}

function createMemoryPongContext(): MemoryPongContext {
  console.log('pong client is run in-memory');

  return new MemoryPongContext();
}
