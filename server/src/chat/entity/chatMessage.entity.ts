import { User } from "src/auth/entity/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { ChatChannel } from "./chatChannel.entity";

@Entity()
export class ChatMessage {
    @PrimaryColumn()
    id: number;

    @Column({ length: 128 })
    content: string;

    @Column()
    createdAt: number;

    @Column()
    authorId: number;

    @Column()
    channelId: number;

    @ManyToOne(() => ChatChannel, {
        cascade: ['remove'],
    })
    @JoinColumn()
    channel: Promise<ChatChannel>
}