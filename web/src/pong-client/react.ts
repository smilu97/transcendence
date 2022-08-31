import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { proxy, useSnapshot } from 'valtio';

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

export function createHttpPongContext(
  options: HttpPongReactOptions,
): HttpPongContext {
  const { httpURL, wsURL } = options;

  if (httpURL === undefined || wsURL === undefined) {
    throw new Error('httpURL, wsURL must be providen for http-context');
  }

  return new HttpPongContext({
    ...getDefaultProxies(),
    baseURL: import.meta.env.PONG_URL || 'http://localhost:3000',
    wsURL: import.meta.env.PONG_WS_URL || 'ws://[::1]:3002',
  });
}

export function createMemoryPongContext(): MemoryPongContext {
  console.log('pong client is run in-memory');

  return new MemoryPongContext(getDefaultProxies());
}

function getDefaultProxies() {
  return {
    proxyFn: proxy,
    snapshotFn: <T extends object>(el: T) => useSnapshot(el) as any,
  };
}

export default function createPong(options: PongReactOptions) {
  const context = createPongContext(options);

  function usePong(): PongContext {
    return context;
  }

  function useAuthGuard(to = '/login') {
    const navigate = useNavigate();
    const pong = usePong();
    const isLogined = pong.auth.isLogined();

    useEffect(() => {
      if (!isLogined) {
        navigate(to);
      }
    }, [isLogined]);
  }

  return { context, usePong, useAuthGuard };
}
