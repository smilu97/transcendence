import configs, { PongEnvs } from './configs';
import createPong, { PongReactOptions } from './pong-client/react';

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

export const { context, usePong, useAuthGuard } = createPong(mapEnvs(configs));
