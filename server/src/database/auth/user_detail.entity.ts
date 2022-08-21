import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class UserDetail {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 500 })
    description: string;
}
