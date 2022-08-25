import { Provider } from "@nestjs/common";
import { Socket } from "dgram";
import { DataSource } from "typeorm";
import { ChatChannel } from "./entity/chatChannel.entity";
import { ChatMember } from "./entity/chatMember.entity";
import { ChatMessage } from "./entity/chatMessage.entity";

import { UserHealth } from "./entity/userHealth.entity";

interface SocketRegistry {
    socket: Socket;
    timestamp: number;
}

export class WSRepository {
    static EXPIRE_MS: number = 10000;

    socketRegistries: { [userId: number]: SocketRegistry } = {};

    register(userId: number, socket: Socket) {
        this.socketRegistries[userId] = { socket, timestamp: Date.now() };
    }
    
    query(userId: number): Socket | undefined {
        const registry = this.socketRegistries[userId];
        if (registry === undefined) {
            return undefined;
        }

        if (registry.timestamp > Date.now() + WSRepository.EXPIRE_MS) {
            return undefined;
        }

        return registry.socket;
    }
}

export const chatRepositories: Provider[] = [
    {
        provide: 'USER_HEALTH_REPOSITORY',
        useFactory: (dataSource: DataSource) => dataSource.getRepository(UserHealth),
        inject: ['DATA_SOURCE'],
    },
    {
        provide: 'CHAT_CHANNEL_REPOSITORY',
        useFactory: (dataSource: DataSource) => dataSource.getRepository(ChatChannel),
        inject: ['DATA_SOURCE'],
    },
    {
        provide: 'CHAT_MEMBER_REPOSITORY',
        useFactory: (dataSource: DataSource) => dataSource.getRepository(ChatMember),
        inject: ['DATA_SOURCE'],
    },
    {
        provide: 'CHAT_MESSAGE_REPOSITORY',
        useFactory: (dataSource: DataSource) => dataSource.getRepository(ChatMessage),
        inject: ['DATA_SOURCE'],
    },
    {
        provide: 'WEBSOCKET_REPOSITORY',
        useFactory: () => new WSRepository(),
        inject: [],
    },
];
