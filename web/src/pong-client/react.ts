import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { proxy, useSnapshot } from 'valtio';

import { PongClient } from './pong-client';

export const reactClient = new PongClient({
  baseURL: import.meta.env.PONG_URL || 'http://localhost:3000',
  wsURL: import.meta.env.PONG_WS_URL || 'ws://[::1]:3002',
  proxyFn: proxy,
  snapshotFn: <T extends object>(el: T) => useSnapshot(el) as any,
});

export function usePong(): PongClient {
  return reactClient;
}

export function useAuthGuard(to = '/login') {
  const navigate = useNavigate();
  const pong = usePong();
  const isLogined = pong.auth.isLogined();

  useEffect(() => {
    if (!isLogined) {
      navigate(to);
    }
  }, [isLogined]);
}
