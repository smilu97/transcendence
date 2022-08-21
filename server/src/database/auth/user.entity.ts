import { Column, Entity, Index, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserDetail } from "./user_detail.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 32 })
    @Index()
    username: string;

    @Column({ length: 128 })
    password: string;

    @OneToOne(() => UserDetail)
    @JoinColumn()
    detail: UserDetail;
}
