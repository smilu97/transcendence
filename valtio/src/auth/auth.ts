export interface HttpBasicAuth {
  type: 'basic';
  username: string;
  password: string;
}

export function makeBasicAuth(
  username: string,
  password: string,
): HttpBasicAuth {
  return {
    type: 'basic',
    username,
    password,
  };
}

export interface HttpBearerAuth {
  type: 'bearer';
  token: string;
}

export function makeBearerAuth(token: string): HttpBearerAuth {
  return {
    type: 'bearer',
    token,
  };
}

export type HttpAuth = HttpBasicAuth | HttpBearerAuth;

export type Auth = HttpAuth;
