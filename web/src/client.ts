import configs from './configs';
import createPong from './pong-client/react';

export const { context, usePong, useAuthGuard } = createPong(configs);
