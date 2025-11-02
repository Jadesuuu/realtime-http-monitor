import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Response as HttpResponse } from '../monitor/entities/response.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'data.db', // SQLite file location
      entities: [HttpResponse], // ✅ Register your entities
      synchronize: true, // ⚠️ Auto-create tables (disable in production!)
      logging: false, // Set to true to see SQL queries in console
    }),
  ],
  exports: [TypeOrmModule], // ✅ Export so other modules can use it
})
export class DatabaseModule {}
