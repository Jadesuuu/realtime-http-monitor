import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { MonitorController } from './monitor.controller';
import { MonitorService } from './monitor.service';
import { MonitorGateway } from './monitor.gateway';
import { Response as HttpResponse } from './entities/response.entity';

@Module({
  imports: [TypeOrmModule.forFeature([HttpResponse]), HttpModule],
  controllers: [MonitorController],
  providers: [MonitorService, MonitorGateway],
  exports: [MonitorService],
})
export class MonitorModule {}
