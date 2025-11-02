import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Response {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  requestPayload: string;

  @Column('text')
  responseData: string;

  @Column()
  statusCode: number;

  @CreateDateColumn()
  timestamp: Date;
}
