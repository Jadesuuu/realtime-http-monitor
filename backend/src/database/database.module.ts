import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Response as HttpResponse } from '../monitor/entities/response.entity';

/**
 * Database Module
 * Configures and provides SQLite database connection using TypeORM.
 *
 * @module DatabaseModule
 */
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'data.db',
      entities: [HttpResponse],
      synchronize: true,
      logging: false,
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
