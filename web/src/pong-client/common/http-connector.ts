import deepmerge from 'deepmerge';

type FetchOption = RequestInit & {
  bearerToken?: string;
};

export type HttpContext = {
  bearerToken?: string;
};

const defaultContext: HttpContext = {
  bearerToken: undefined,
};

export default class HttpConnector {
  private contextProvider?: () => HttpContext;

  constructor(private baseURL: string | URL) {}

  fetch(url: URL | string, option: FetchOption = {}): Promise<Response> {
    const context = this.contextProvider
      ? this.contextProvider()
      : defaultContext;

    const bearerToken = option.bearerToken || context.bearerToken;
    const authHeader = bearerToken
      ? {
          Authorization: `Bearer ${bearerToken}`,
        }
      : undefined;

    const baseInit: RequestInit = {
      method: 'GET',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader,
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
    };

    return fetch(new URL(url, this.baseURL), deepmerge(baseInit, option));
  }

  get(url: URL | string, init: FetchOption = {}): Promise<Response> {
    const baseInit: FetchOption = {
      method: 'GET',
    };

    return this.fetch(url, deepmerge(baseInit, init));
  }

  post(
    url: URL | string,
    body: string | Object,
    init: FetchOption = {},
  ): Promise<Response> {
    const serializedBody = body instanceof Object ? JSON.stringify(body) : body;

    const baseInit: FetchOption = {
      method: 'POST',
      body: serializedBody,
    };

    return this.fetch(url, deepmerge(baseInit, init));
  }

  setContextProvider(provider: () => HttpContext) {
    this.contextProvider = provider;
  }
}
