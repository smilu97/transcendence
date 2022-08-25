import { User } from "src/auth/entity/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { ChatChannel } from "./chatChannel.entity";

@Entity()
export class ChatMember {
    @PrimaryColumn()
    channelId: number;

    @PrimaryColumn()
    userId: number;

    @Column({ length: 16 })
    role: 'USER' | 'ADMIN';

    @ManyToOne(() => ChatChannel, { cascade: ['remove'] })
    @JoinColumn()
    channel: Promise<ChatChannel>;

    @ManyToOne(() => User, { cascade: ['remove'] })
    @JoinColumn()
    user: Promise<User>;
}
