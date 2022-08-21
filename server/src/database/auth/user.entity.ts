import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 32 })
    @Index()
    username: string;

    @Column({ length: 128 })
    password: string;
}
