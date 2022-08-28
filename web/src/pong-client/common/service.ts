import { DeepReadonly } from 'ts-essentials';
import { PongClient } from '../pong-client';

export type ProxyFn = <T extends object>(x?: T) => T;
export type SnapshotFn = <T extends object>(x: T) => DeepReadonly<T>;

export type CommonServiceOptions = {
  root: PongClient;
  proxyFn?: ProxyFn;
  snapshotFn?: SnapshotFn;
};

export const defaultProxyFn: ProxyFn = (el) =>
  el === undefined ? ({} as any) : el;

export function defaultSnapshotFn<T>(x: T): DeepReadonly<T> {
  return x as DeepReadonly<T>;
}

export class Service<StateType extends object> {
  protected readonly root: PongClient;
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
}
