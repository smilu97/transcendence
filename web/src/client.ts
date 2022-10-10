import { createPongContext, PongContext, PongReactOptions } from 'valtio-pong';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

import configs, { PongEnvs } from './configs';

function mapEnvs(envs: PongEnvs): PongReactOptions {
  if (envs.contextType === 'http') {
    const { httpURL, wsURL } = envs;

    if (!httpURL || !wsURL) {
      throw new Error('httpURL or wsURL is empty');
    }

    return {
      contextType: 'http',
      httpURL,
      wsURL,
    };
  } else {
    return {
      contextType: 'memory',
    };
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

export const { context, usePong, useAuthGuard } = createPong(mapEnvs(configs));
