import { Controller, Get, Post } from '@nestjs/common';
import { MonitorService } from './monitor.service';
import { Response as HttpResponse } from './entities/response.entity';

/**
 * Monitor Controller
 *
 * REST API endpoints for HTTP monitoring functionality.
 *
 * Endpoints:
 * - GET  /api/monitor/responses - Fetch historical response data
 * - POST /api/monitor/trigger   - Manually trigger HTTP ping
 *
 * @controller /api/monitor
 */
@Controller('monitor')
export class MonitorController {
  constructor(private readonly monitorService: MonitorService) {}

  /**
   * GET /api/monitor/responses
   *
   * Retrieves all stored HTTP response records.
   * Returns last 100 records in descending order by timestamp.
   *
   * @returns {Promise<HttpResponse[]>} Array of response objects
   */
  @Get('responses')
  getAllResponses(): Promise<HttpResponse[]> {
    return this.monitorService.getAllResponses();
  }

  /**
   * POST /api/monitor/trigger
   *
   * Manually triggers an HTTP ping to httpbin.org/anything.
   * Useful for testing without waiting for cron schedule.
   *
   * @returns {Promise<HttpResponse | null>} Newly created response object
   */
  @Post('trigger')
  triggerPing(): Promise<HttpResponse | null> {
    return this.monitorService.triggerPing();
  }
}
