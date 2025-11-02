import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MonitorModule } from './monitor/monitor.module';
import { DatabaseModule } from './database/database.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    // Enable cron jobs
    ScheduleModule.forRoot(),

    // Configure SQLite database
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'data.db',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),

    // Import monitor module
    MonitorModule,
    DatabaseModule,
    ScheduleModule,
    HttpModule,
  ],
})
export class AppModule {}
