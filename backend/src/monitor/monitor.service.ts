import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MonitorGateway } from './monitor.gateway';
import { Repository } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import axios from 'axios';
import { HttpService } from '@nestjs/axios';
import { Response as HttpResponse } from './entities/response.entity';

@Injectable()
export class MonitorService {
  constructor(
    @InjectRepository(HttpResponse)
    private responseRepository: Repository<HttpResponse>,
    private httpService: HttpService,
    private monitorGateway: MonitorGateway,
  ) {}

  @Cron(CronExpression.EVERY_5_MINUTES)
  async pingHttBin() {
    try {
      const randomPayload = {
        timeStamp: new Date().toISOString(),
        random: Math.random(),
        data: {
          value1: Math.floor(Math.random() * 100),
          value2: `test-${Date.now()}`,
        },
      };

      const response = await axios.post(
        'https://httpbin.org/anything',
        randomPayload,
      );

      const savedResponse = await this.responseRepository.save({
        requestPayload: JSON.stringify(randomPayload),
        responseData: JSON.stringify(response.data),
        statusCode: response.status,
      });

      this.monitorGateway.broadcastNewResponse(savedResponse);
      console.log('✅ Ping successful:', savedResponse.id);
      return savedResponse;
    } catch (error) {
      if (error instanceof Error) {
        console.error('Ping failed:', error.message);
      } else {
        console.error('Ping failed: ', String(error));
      }
      throw error;
    }
  }

  async getAllResponses(): Promise<HttpResponse[]> {
    return this.responseRepository.find({
      order: { timestamp: 'DESC' },
      take: 100,
    });
  }

  /**
   * manual trigger for testing
   * @returns
   */
  async triggerPing() {
    return this.pingHttBin();
  }
}
