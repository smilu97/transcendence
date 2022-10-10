import deepmerge from 'deepmerge';
import { HttpAuth, HttpBasicAuth, HttpBearerAuth } from '../auth';

type FetchOption = RequestInit & {
  auth?: HttpAuth;
};

export default class HttpConnector {
  constructor(private baseURL: string | URL) {}

  fetch(url: URL | string, option: FetchOption = {}): Promise<Response> {
    const baseInit: RequestInit = {
      method: 'GET',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        Authorization: this.extractAuthorization(option.auth),
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

  private extractAuthorization(auth?: HttpAuth): string {
    if (!auth) {
      return '';
    }

    switch (auth.type) {
      case 'basic':
        return this.extractBasicAuthorization(auth);
      case 'bearer':
        return this.extractBearerAuthorization(auth);
      default:
        return '';
    }
  }

  private extractBearerAuthorization(auth: HttpBearerAuth): string {
    const { token } = auth;
    return `Bearer ${token}`;
  }

  private extractBasicAuthorization(auth: HttpBasicAuth): string {
    const { username, password } = auth;
    const token = btoa(`${username}:${password}`);
    return `Basic ${token}`;
  }
}
