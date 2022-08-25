import { ConflictException, Inject, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";

import { UuidService } from "src/database/snowflake.service";

import { UserHealth } from "./entity/userHealth.entity";
import { WSRepository } from "./chat.repository";
import { Socket } from "dgram";
import { ChatChannel } from "./entity/chatChannel.entity";
import { ChatMember } from "./entity/chatMember.entity";
import { ChatMessage } from "./entity/chatMessage.entity";
import { User } from "src/auth/entity/user.entity";

interface CreateChannelOptions {
    name: string;
    type: 'PUBLIC' | 'PRIVATE';
    password: string;
}

@Injectable()
export class ChatService {
    constructor(
        private uuidService: UuidService,
        @Inject('DATA_SOURCE') private dataSource: DataSource,
        @Inject('USER_HEALTH_REPOSITORY') private healthRepo: Repository<UserHealth>,
        @Inject('CHAT_CHANNEL_REPOSITORY') private channelRepo: Repository<ChatChannel>,
        @Inject('CHAT_MEMBER_REPOSITORY') private memberRepo: Repository<ChatMember>,
        @Inject('WEBSOCKET_REPOSITORY') private wsRepo: WSRepository,
    ) {}

    async updateHealth(socket: Socket, userId: number, content: string): Promise<void> {
        // Refresh WebSocket connection
        this.wsRepo.register(userId, socket);

        // Update Status Message
        const timestamp = Date.now();
        const health = { userId, content, timestamp };
        await this.healthRepo.upsert(health, ['userId']);
    }

    async createChannel(userId: number, options: CreateChannelOptions): Promise<ChatChannel> {
        let channel: ChatChannel = null;
        await this.dataSource.transaction('READ COMMITTED', async em => {
            const password = options.type === 'PRIVATE' ? '' : options.password;
            channel = await em.create(ChatChannel, {
                id: this.uuidService.id(),
                ownerId: userId,
                type: options.type,
                name: options.name,
                password,
            });

            await em.create(ChatMember, {
                channelId: channel.id,
                userId,
                role: 'ADMIN',
            });
        });
        return channel;
    }

    async joinChannel(userId: number, channelId: number): Promise<void> {
        await this.dataSource.transaction('READ COMMITTED', async em => {
            if (await em.findOneBy(ChatMember, { userId, channelId })) {
                throw new ConflictException();
            }

            await em.create(ChatMember, { userId, channelId, role: 'USER' });
        });
    }

    async leaveChannel(userId: number, channelId: number): Promise<void> {
        await this.dataSource.transaction('READ COMMITTED', async em => {
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
        const memberIds = memberships.map(el => el.userId);

        if (channel.type === 'PUBLIC' && channel.password.length === 0) {
            return memberIds;
        }
        
        if (memberIds.indexOf(userId) === -1) {
            throw new NotFoundException();
        }

        return memberIds;
    }

    async talk(userId: number, channelId: number, content: string): Promise<void> {
        const message = {
            id: this.uuidService.id(),
            channelId,
            authorId: userId,
            content,
            createdAt: Date.now()
        };

        let members: User[] = [];

        await this.dataSource.transaction('READ COMMITTED', async em => {
            const membership = await em.findOneBy(ChatMember, { userId, channelId });
            if (membership === null) {
                throw new UnauthorizedException();
            }

            const channel = await em.findOneBy(ChatChannel, { id: channelId });
            if (channel === null) {
                throw new NotFoundException();
            }

            await em.create(ChatMessage, message);

            members = await channel.members;
        });

        this.emitToMembers(members, 'newMessage', JSON.stringify(message));
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
        members.forEach(member => {
            const socket = this.wsRepo.query(member.id);
            if (socket !== undefined) {
                socket.emit(event, ...args);
            }
        });
    }
}
