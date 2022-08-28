import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { UserDetail } from './userDetail.entity';

@Entity()
export class User {
  @PrimaryColumn()
  id: number;

  @Column({ length: 32 })
  @Index()
  username: string;

  @Column({ length: 128 })
  password: string;

  @OneToOne(() => UserDetail)
  @JoinColumn()
  detail: UserDetail;
}
