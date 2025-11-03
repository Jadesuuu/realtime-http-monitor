import { Test, TestingModule } from '@nestjs/testing';
import { MonitorGateway } from './monitor.gateway';
import { Response as HttpResponse } from './entities/response.entity';
import { Server } from 'socket.io';

describe('MonitorGateway', () => {
  let gateway: MonitorGateway;
  let mockServer: Partial<Server>;

  beforeEach(async () => {
    mockServer = {
      emit: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [MonitorGateway],
    }).compile();

    gateway = module.get<MonitorGateway>(MonitorGateway);

    gateway.server = mockServer as Server;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  describe('broadcastNewResponse', () => {
    it('should emit newResponse event with response data', () => {
      const mockResponse: HttpResponse = {
        id: 1,
        requestPayload: JSON.stringify({ test: 'data' }),
        responseData: JSON.stringify({ origin: '127.0.0.1' }),
        statusCode: 200,
        responseTime: 100,
        timestamp: new Date(),
      };

      gateway.broadcastNewResponse(mockResponse);

      expect(mockServer.emit).toHaveBeenCalledWith('newResponse', mockResponse);
      expect(mockServer.emit).toHaveBeenCalledTimes(1);
    });

    it('should broadcast successful responses', () => {
      const mockResponse: HttpResponse = {
        id: 42,
        requestPayload: '{}',
        responseData: '{}',
        statusCode: 200,
        responseTime: 150,
        timestamp: new Date(),
      };

      gateway.broadcastNewResponse(mockResponse);

      expect(mockServer.emit).toHaveBeenCalledWith('newResponse', mockResponse);
    });

    it('should broadcast failed responses', () => {
      const mockErrorResponse: HttpResponse = {
        id: 2,
        requestPayload: '{}',
        responseData: '{"error": "Server error"}',
        statusCode: 500,
        responseTime: 200,
        timestamp: new Date(),
      };

      gateway.broadcastNewResponse(mockErrorResponse);

      expect(mockServer.emit).toHaveBeenCalledWith(
        'newResponse',
        mockErrorResponse,
      );
    });

    it('should handle responses with zero response time', () => {
      const mockNullResponse: HttpResponse = {
        id: 3,
        requestPayload: '{}',
        responseData: '{}',
        statusCode: 0,
        responseTime: 0,
        timestamp: new Date(),
      };

      gateway.broadcastNewResponse(mockNullResponse);

      expect(mockServer.emit).toHaveBeenCalledWith(
        'newResponse',
        mockNullResponse,
      );
    });
  });

  describe('server', () => {
    it('should have a server instance', () => {
      expect(gateway.server).toBeDefined();
    });

    it('should be able to emit events through server', () => {
      const testData = { test: 'data' };

      gateway.server.emit('testEvent', testData);

      expect(mockServer.emit).toHaveBeenCalledWith('testEvent', testData);
    });
  });
});
