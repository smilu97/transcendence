import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Logger } from 'winston';

import { UuidService } from 'src/database/snowflake.service';

import { UserHealth } from './entity/userHealth.entity';
import { WSRepository } from './chat.repository';
import { Socket } from 'dgram';
import { ChatChannel } from './entity/chatChannel.entity';
import { ChatMember } from './entity/chatMember.entity';
import { ChatMessage } from './entity/chatMessage.entity';
import { User } from 'src/auth/entity/user.entity';

interface CreateChannelOptions {
  name: string;
  type: 'PUBLIC' | 'PRIVATE';
  password: string;
}

@Injectable()
export class ChatService {
  constructor(
    private uuidService: UuidService,
    @Inject('LOGGER') private logger: Logger,
    @Inject('DATA_SOURCE') private dataSource: DataSource,
    @Inject('USER_HEALTH_REPOSITORY')
    private healthRepo: Repository<UserHealth>,
    @Inject('CHAT_CHANNEL_REPOSITORY')
    private channelRepo: Repository<ChatChannel>,
    @Inject('CHAT_MEMBER_REPOSITORY')
    private memberRepo: Repository<ChatMember>,
    @Inject('WEBSOCKET_REPOSITORY') private wsRepo: WSRepository,
  ) {}

  async updateHealth(
    socket: Socket,
    userId: number,
    content: string,
  ): Promise<void> {
    // Refresh WebSocket connection
    this.wsRepo.register(userId, socket);

    // Update Status Message
    const timestamp = Date.now();
    const health = { userId, content, timestamp };
    await this.healthRepo.upsert(health, ['userId']);
  }

  async getChannels(): Promise<ChatChannel[]> {
    return (await this.channelRepo.find()).filter((ch) => ch.type !== 'DIRECT');
  }

  async getJoinedChannels(userId: number): Promise<ChatChannel[]> {
    return await this.memberRepo
      .createQueryBuilder('member')
      .select('channel.*')
      .leftJoin(ChatChannel, 'channel', 'member.channelId = channel.id')
      .where('member.userId = :userId', { userId })
      .getRawMany();
  }

  async createChannel(
    userId: number,
    options: CreateChannelOptions,
  ): Promise<ChatChannel> {
    let channel: ChatChannel = null;
    await this.dataSource.transaction('READ COMMITTED', async (em) => {
      const password = options.type === 'PRIVATE' ? '' : options.password;
      channel = await em.save(ChatChannel, {
        id: this.uuidService.id(),
        ownerId: userId,
        type: options.type,
        name: options.name,
        password,
      });

      await em.save(ChatMember, {
        channelId: channel.id,
        userId,
        role: 'ADMIN',
      });
    });
    return channel;
  }

  async joinChannel(
    userId: number,
    channelId: number,
    password = '',
  ): Promise<void> {
    const channel = await this.channelRepo.findOneBy({ id: channelId });
    if (channel === null) {
      throw new NotFoundException();
    }

    if (
      channel.type === 'DIRECT' ||
      (channel.type === 'PRIVATE' && channel.password !== password)
    ) {
      throw new NotFoundException();
    }

    await this.dataSource.transaction('READ COMMITTED', async (em) => {
      if (await em.findOneBy(ChatMember, { userId, channelId })) {
        return;
      }

      await em.save(ChatMember, { userId, channelId, role: 'USER' });
    });
  }

  async leaveChannel(userId: number, channelId: number): Promise<void> {
    await this.dataSource.transaction('READ COMMITTED', async (em) => {
      const membership = await em.findOneBy(ChatMember, { userId, channelId });
      if (membership === null) {
        throw new NotFoundException();
      }

      await em.remove(membership);
    });
  }

  async getMembers(userId: number, channelId: number): Promise<number[]> {
    const channel = await this.channelRepo.findOneBy({ id: channelId });
    if (channel === null) {
      throw new NotFoundException();
    }

    const memberships = await this.memberRepo.findBy({ channelId });
    const memberIds = memberships.map((el) => el.userId);

    if (channel.type === 'PUBLIC' && channel.password.length === 0) {
      return memberIds;
    }

    if (memberIds.indexOf(userId) === -1) {
      throw new NotFoundException();
    }

    return memberIds;
  }

  async talk(
    userId: number,
    channelId: number,
    content: string,
  ): Promise<void> {
    const message = {
      id: this.uuidService.id(),
      channelId,
      authorId: userId,
      content,
      createdAt: Date.now(),
    };

    let members: User[] = [];

    await this.dataSource.transaction('READ COMMITTED', async (em) => {
      const membership = await em.findOneBy(ChatMember, { userId, channelId });
      if (membership === null) {
        throw new UnauthorizedException();
      }

      const channel = await em.findOneBy(ChatChannel, { id: channelId });
      if (channel === null) {
        throw new NotFoundException();
      }

      await em.save(ChatMessage, message);

      members = await channel.members;
    });

    this.emitToMembers(members, 'newMessage', message);
  }

  async getMessages(userId: number, channelId: number): Promise<ChatMessage[]> {
    const channel = await this.channelRepo.findOneBy({ id: channelId });
    if (channel === null) {
      throw new NotFoundException();
    }

    const membership = await this.memberRepo.findOneBy({ userId, channelId });
    if (membership === null) {
      if (channel.type === 'PUBLIC') {
        throw new UnauthorizedException();
      } else {
        throw new NotFoundException();
      }
    }

    return await channel.messages;
  }

  async emitToMembers(members: User[], event: string | symbol, ...args: any[]) {
    members.forEach((member) => {
      this.wsRepo.query(member.id).forEach((socket) => {
        this.emitToSocket(socket, event, ...args);
      });
    });
  }

  private async emitToSocket(
    socket: Socket,
    event: string | symbol,
    ...args: any[]
  ) {
    try {
      socket.emit(event, ...args);
    } catch {
      this.logger.log('Failed to emit', socket);
    }
  }
}
