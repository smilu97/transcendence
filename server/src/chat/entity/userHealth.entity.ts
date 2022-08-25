import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class UserHealth {
    @PrimaryColumn()
    userId: number;

    @Column({ length: 16 })
    content: string;

    @Column()
    timestamp: number;
}
