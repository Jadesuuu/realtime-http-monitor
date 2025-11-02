import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

/**
 * Response Entity
 *
 * Database model for storing HTTP response data.
 *
 * @entity response
 */
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

  @Column({ default: 0 })
  responseTime: number;

  @CreateDateColumn()
  timestamp: Date;
}
