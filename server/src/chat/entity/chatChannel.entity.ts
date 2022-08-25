import { User } from "src/auth/entity/user.entity";
import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryColumn } from "typeorm";
import { ChatMessage } from "./chatMessage.entity";

@Entity()
export class ChatChannel {
    @PrimaryColumn()
    id: number;

    @Column()
    ownerId: number;

    @Column({ length: 8 })
    type: 'DIRECT' | 'PUBLIC' | 'PRIVATE';

    @Column({ length: 32 })
    name: string;

    @Column({ length: 32 })
    password: string;

    @ManyToMany(() => User)
    @JoinTable({
        name: 'chat_member',
        joinColumn: { name: 'userId', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'channelId', referencedColumnName: 'id' },
    })
    members: Promise<User[]>;

    @OneToMany(() => ChatMessage, 'channelId')
    messages: Promise<ChatMessage[]>;
}
