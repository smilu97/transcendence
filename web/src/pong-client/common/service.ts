import { DeepReadonly } from 'ts-essentials';
import { HttpAuth } from '../auth';
import { PongContext, SharedState } from '../context';

export type ProxyFn = <T extends object>(x?: T) => T;
export type SnapshotFn = <T extends object>(x: T) => DeepReadonly<T>;

export type CommonServiceOptions = {
  root: PongContext;
  proxyFn?: ProxyFn;
  snapshotFn?: SnapshotFn;
};

export const defaultProxyFn: ProxyFn = (el) =>
  el === undefined ? ({} as any) : el;

export function defaultSnapshotFn<T>(x: T): DeepReadonly<T> {
  return x as DeepReadonly<T>;
}

export class Service<StateType extends object> {
  protected readonly root: PongContext;
  readonly state: StateType;

  private readonly snapshotFn: SnapshotFn;

  protected constructor(
    public name: string,
    initialState: StateType,
    {
      root,
      proxyFn = defaultProxyFn,
      snapshotFn = defaultSnapshotFn,
    }: CommonServiceOptions,
  ) {
    this.root = root;
    this.snapshotFn = snapshotFn;
    this.state = proxyFn(initialState);
  }

  protected getSnapshot(): DeepReadonly<StateType> {
    return this.snapshotFn(this.state);
  }

  protected getSharedSnapshot(): DeepReadonly<SharedState> {
    return this.snapshotFn(this.root.shared);
  }

  protected getHttpAuthRequired(): HttpAuth {
    const { auth } = this.root.shared;
    if (!auth) {
      throw new Error(
        'Unexpected error: getTokenRequired without authorization',
      );
    }
    return auth;
  }
}
