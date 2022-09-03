import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { proxy, useSnapshot } from 'valtio';

import { HttpPongContext, MemoryPongContext, PongContext } from './context';

export interface PongReactOptions {
  httpURL?: string;
  wsURL?: string;
  contextType: 'http' | 'memory';
}

export function createPongContext(options: PongReactOptions): PongContext {
  const { httpURL, wsURL, contextType } = options;

  const proxies = {
    proxyFn: proxy,
    snapshotFn: <T extends object>(el: T) => useSnapshot(el) as any,
  };

  if (contextType === 'http') {
    if (httpURL === undefined || wsURL === undefined) {
      throw new Error('httpURL, wsURL must be providen for http-context');
    }

    return new HttpPongContext({
      baseURL: import.meta.env.PONG_URL || 'http://localhost:3000',
      wsURL: import.meta.env.PONG_WS_URL || 'ws://[::1]:3002',
      ...proxies,
    });
  } else {
    console.log('pong client is run in-memory');
    return new MemoryPongContext({
      ...proxies,
    });
  }
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
