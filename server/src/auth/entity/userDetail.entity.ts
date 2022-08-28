import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class UserDetail {
  @PrimaryColumn()
  id: number;

  @Column({ length: 500 })
  description: string;
}
