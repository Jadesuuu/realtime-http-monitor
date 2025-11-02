import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MonitorGateway } from './monitor.gateway';
import { Repository } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { HttpService } from '@nestjs/axios';
import { Response as HttpResponse } from './entities/response.entity';
import { firstValueFrom } from 'rxjs/internal/firstValueFrom';

/**
 * Monitor Service
 *
 * Core service for HTTP monitoring functionality.
 *
 * Responsibilities:
 * - Periodically ping httpbin.org/anything endpoint (every 5 minutes)
 * - Generate random JSON payload for each request
 * - Store response data in SQLite database
 * - Broadcast new data to connected WebSocket clients
 * - Provide historical data retrieval
 *
 * Technical Implementation:
 * - Uses NestJS @Cron decorator for scheduling
 * - Leverages HttpService (Axios) for HTTP requests
 * - TypeORM repository pattern for database operations
 * - WebSocket gateway integration for real-time updates
 *
 * @class MonitorService
 */
@Injectable()
export class MonitorService {
  constructor(
    @InjectRepository(HttpResponse)
    private responseRepository: Repository<HttpResponse>,
    private httpService: HttpService,
    private monitorGateway: MonitorGateway,
  ) {}

  /**
   * Automated HTTP Ping (Cron Job)
   *
   * Pings httpbin.org/anything endpoint every 5 minutes.
   * Generates random payload, stores response, and broadcasts to clients.
   *
   * @cron Every 5 minutes
   * @returns {Promise<HttpResponse | null>} Saved response or null on error
   */
  @Cron(CronExpression.EVERY_5_MINUTES)
  async pingHttBin(): Promise<HttpResponse | null> {
    try {
      // Generate random JSON payload as per requirements
      const randomPayload = {
        timeStamp: new Date().toISOString(),
        random: Math.random(),
        data: {
          value1: Math.floor(Math.random() * 100),
          value2: `test-${Date.now()}`,
        },
      };

      // Start timer
      const startTime = Date.now();

      // Make HTTP POST request to httpbin.org/anything
      const response = await firstValueFrom(
        this.httpService.post('https://httpbin.org/anything', randomPayload, {
          timeout: 10000,
        }),
      );

      // Calculate response time in milliseconds
      const responseTime = Date.now() - startTime;

      // Store response in database
      const savedResponse = await this.responseRepository.save({
        requestPayload: JSON.stringify(randomPayload),
        responseData: JSON.stringify(response.data),
        statusCode: response.status,
        responseTime, // Add the calculated response time
      });

      // Broadcast to connected WebSocket clients for real-time updates
      this.monitorGateway.broadcastNewResponse(savedResponse);
      console.log('Ping successful:', savedResponse.id, `(${responseTime}ms)`);
      return savedResponse;
    } catch (error) {
      if (error instanceof Error) {
        console.error('Ping failed:', error.message);
      } else {
        console.error('Ping failed: ', String(error));
      }
      return null;
    }
  }

  /**
   * Retrieve Historical Data
   *
   * Fetches all stored HTTP responses from the database.
   * Limited to last 100 records for performance.
   *
   * @returns {Promise<HttpResponse[]>} Array of response records
   */
  async getAllResponses(): Promise<HttpResponse[]> {
    return this.responseRepository.find({
      order: { timestamp: 'DESC' },
      take: 100,
    });
  }

  /**
   * manual trigger for testing
   *
   * @returns {Promise<HttpResponse | null>} Saved response
   */
  async triggerPing(): Promise<HttpResponse | null> {
    return this.pingHttBin();
  }
}
