import { Provider } from '@nestjs/common';
import { Socket } from 'dgram';
import { DataSource } from 'typeorm';
import { ChatChannel } from './entity/chatChannel.entity';
import { ChatMember } from './entity/chatMember.entity';
import { ChatMessage } from './entity/chatMessage.entity';

import { UserHealth } from './entity/userHealth.entity';

interface SocketRegistry {
  socket: Socket;
  userId: number;
  timestamp: number;
}

export class WSRepository {
  static EXPIRE_MS: number = 10000;

  socketRegistries: { [userId: number]: SocketRegistry[] } = {};

  register(userId: number, socket: Socket) {
    this.cleanRegistryList(userId);
    const registry: SocketRegistry = { socket, userId, timestamp: Date.now() };
    const container = this.getRegistryList(userId);
    const prev: SocketRegistry | undefined = container.find(
      (e) => e.socket === socket,
    );
    if (prev === undefined) {
      container.push(registry);
    } else {
      prev.timestamp = Date.now();
    }
  }

  query(userId: number): Socket[] {
    this.cleanRegistryList(userId);
    console.log(
      userId,
      'has',
      this.getRegistryList(userId).length,
      'registries',
    );
    return this.getRegistryList(userId)
      .filter(this.isAlive)
      .map((el) => el.socket);
  }

  private cleanRegistryList(userId: number): void {
    this.socketRegistries[userId] = this.getRegistryList(userId).filter(
      this.isAlive,
    );
  }

  private isAlive(registry: SocketRegistry): boolean {
    return registry.timestamp >= Date.now() - WSRepository.EXPIRE_MS;
  }

  private getRegistryList(userId: number): SocketRegistry[] {
    if (this.socketRegistries[userId] === undefined) {
      return (this.socketRegistries[userId] = []);
    }
    return this.socketRegistries[userId];
  }
}

export const chatRepositories: Provider[] = [
  {
    provide: 'USER_HEALTH_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(UserHealth),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'CHAT_CHANNEL_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(ChatChannel),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'CHAT_MEMBER_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(ChatMember),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'CHAT_MESSAGE_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(ChatMessage),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'WEBSOCKET_REPOSITORY',
    useFactory: () => new WSRepository(),
    inject: [],
  },
];
