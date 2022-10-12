import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../common/typeorm';

export type TransactionActionType = 'register' | 'login' | 'restaurants';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'transactionId',
  })
  id: number;

  @Column({
    type: 'enum',
    nullable: false,
    enum: ['register', 'login', 'getRestaurants', 'getTransactions'],
  })
  action: string;

  @Column({
    nullable: false,
    default: '',
  })
  url: string;

  @Column({
    type: 'json',
    nullable: false,
    default: {},
  })
  result: object;

  @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
