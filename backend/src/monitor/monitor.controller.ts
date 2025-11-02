import { Controller, Get, Post } from '@nestjs/common';
import { MonitorService } from './monitor.service';
import { Response as HttpResponse } from './entities/response.entity';

@Controller('monitor')
export class MonitorController {
  constructor(private readonly monitorService: MonitorService) {}

  @Get('responses')
  getAllResponses(): Promise<HttpResponse[]> {
    return this.monitorService.getAllResponses();
  }

  @Post('trigger')
  triggerPing() {
    return this.monitorService.triggerPing();
  }
}
