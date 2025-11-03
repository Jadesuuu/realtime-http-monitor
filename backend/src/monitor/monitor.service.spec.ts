/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HttpService } from '@nestjs/axios';
import { MonitorService } from './monitor.service';
import { MonitorGateway } from './monitor.gateway';
import { Response as HttpResponse } from './entities/response.entity';
import { Repository } from 'typeorm';
import { of, throwError } from 'rxjs';
import { AxiosResponse, InternalAxiosRequestConfig } from 'axios';

/**
 * Mock types for testing
 */
type MockRepository = Partial<
  Record<keyof Repository<HttpResponse>, jest.Mock>
>;
type MockHttpService = Partial<Record<keyof HttpService, jest.Mock>>;
type MockGateway = Partial<Record<keyof MonitorGateway, jest.Mock>>;

/**
 * Helper to create typed AxiosResponse
 */
function createMockAxiosResponse<T>(data: T, status = 200): AxiosResponse<T> {
  const config: Partial<InternalAxiosRequestConfig> = {
    url: 'https://httpbin.org/anything',
    method: 'post',
    headers: {} as any, // Axios internal type requires any
  };

  return {
    data,
    status,
    statusText: 'OK',
    headers: {},
    config: config as InternalAxiosRequestConfig,
  };
}

describe('MonitorService', () => {
  let service: MonitorService;
  let mockRepository: MockRepository;
  let mockHttpService: MockHttpService;
  let mockGateway: MockGateway;

  beforeEach(async () => {
    mockRepository = {
      save: jest.fn(),
      find: jest.fn(),
    };

    mockHttpService = {
      post: jest.fn(),
    };

    mockGateway = {
      broadcastNewResponse: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MonitorService,
        {
          provide: getRepositoryToken(HttpResponse),
          useValue: mockRepository,
        },
        {
          provide: HttpService,
          useValue: mockHttpService,
        },
        {
          provide: MonitorGateway,
          useValue: mockGateway,
        },
      ],
    }).compile();

    service = module.get<MonitorService>(MonitorService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('pingHttBin', () => {
    it('should successfully ping httpbin and save response', async () => {
      const mockAxiosResponse = createMockAxiosResponse({
        args: {},
        headers: {
          'Content-Type': 'application/json',
        },
        origin: '127.0.0.1',
        url: 'https://httpbin.org/anything',
      });

      const mockSavedResponse: HttpResponse = {
        id: 1,
        requestPayload: JSON.stringify({
          timeStamp: '2025-11-02T00:00:00.000Z',
          random: 0.5,
          data: { value1: 50, value2: 'test-123' },
        }),
        responseData: JSON.stringify(mockAxiosResponse.data),
        statusCode: 200,
        responseTime: 100,
        timestamp: new Date(),
      };

      mockHttpService.post?.mockReturnValue(of(mockAxiosResponse));
      mockRepository.save?.mockResolvedValue(mockSavedResponse);

      const result = await service.pingHttBin();

      expect(mockHttpService.post).toHaveBeenCalledWith(
        'https://httpbin.org/anything',
        expect.objectContaining({
          timeStamp: expect.stringMatching(
            /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/,
          ),
          random: expect.any(Number),
          data: expect.objectContaining({
            value1: expect.any(Number),
            value2: expect.stringMatching(/^test-\d+$/),
          }),
        }),
        { timeout: 10000 },
      );
      expect(mockRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 200,
          responseTime: expect.any(Number),
          requestPayload: expect.any(String),
          responseData: expect.any(String),
        }),
      );
      expect(mockGateway.broadcastNewResponse).toHaveBeenCalledWith(
        mockSavedResponse,
      );
      expect(result).toEqual(mockSavedResponse);
    });

    it('should track response time correctly', async () => {
      const mockAxiosResponse = createMockAxiosResponse({ test: 'data' });

      const mockSavedResponse: Partial<HttpResponse> = {
        id: 1,
        responseTime: 0,
      };

      mockHttpService.post?.mockReturnValue(of(mockAxiosResponse));
      mockRepository.save?.mockResolvedValue(mockSavedResponse as HttpResponse);

      await service.pingHttBin();

      const saveCall = mockRepository.save?.mock
        .calls[0][0] as Partial<HttpResponse>;
      expect(saveCall.responseTime).toBeGreaterThanOrEqual(0);
      expect(typeof saveCall.responseTime).toBe('number');
    });

    it('should handle HTTP errors gracefully', async () => {
      const error = new Error('Network error');
      mockHttpService.post?.mockReturnValue(throwError(() => error));

      const result = await service.pingHttBin();

      expect(result).toBeNull();
    });

    it('should generate random payload with correct structure', async () => {
      const mockAxiosResponse = createMockAxiosResponse({});

      const mockSavedResponse: Partial<HttpResponse> = { id: 1 };

      mockHttpService.post?.mockReturnValue(of(mockAxiosResponse));
      mockRepository.save?.mockResolvedValue(mockSavedResponse as HttpResponse);

      await service.pingHttBin();

      const httpCall = mockHttpService.post?.mock.calls[0][1] as {
        timeStamp: string;
        random: number;
        data: { value1: number; value2: string };
      };

      expect(httpCall).toHaveProperty('timeStamp');
      expect(httpCall).toHaveProperty('random');
      expect(httpCall).toHaveProperty('data');
      expect(httpCall.data).toHaveProperty('value1');
      expect(httpCall.data).toHaveProperty('value2');
      expect(typeof httpCall.random).toBe('number');
      expect(httpCall.random).toBeGreaterThanOrEqual(0);
      expect(httpCall.random).toBeLessThanOrEqual(1);
      expect(typeof httpCall.data.value1).toBe('number');
      expect(httpCall.data.value1).toBeGreaterThanOrEqual(0);
      expect(httpCall.data.value1).toBeLessThan(100);
      expect(typeof httpCall.data.value2).toBe('string');
      expect(httpCall.data.value2).toMatch(/^test-\d+$/);
    });
  });

  describe('getAllResponses', () => {
    it('should retrieve all responses from database', async () => {
      const mockResponses: HttpResponse[] = [
        {
          id: 1,
          requestPayload: '{}',
          responseData: '{}',
          statusCode: 200,
          responseTime: 100,
          timestamp: new Date(),
        },
        {
          id: 2,
          requestPayload: '{}',
          responseData: '{}',
          statusCode: 200,
          responseTime: 150,
          timestamp: new Date(),
        },
        {
          id: 3,
          requestPayload: '{}',
          responseData: '{}',
          statusCode: 200,
          responseTime: 150,
          timestamp: new Date(),
        },
        {
          id: 4,
          requestPayload: '{}',
          responseData: '{}',
          statusCode: 200,
          responseTime: 150,
          timestamp: new Date(),
        },
      ];

      mockRepository.find?.mockResolvedValue(mockResponses);

      const result = await service.getAllResponses();

      expect(mockRepository.find).toHaveBeenCalledWith({
        order: { timestamp: 'DESC' },
        take: 100,
      });
      expect(result).toEqual(mockResponses);
      expect(result).toHaveLength(2);
    });

    it('should limit results to 100 records', async () => {
      mockRepository.find?.mockResolvedValue([]);

      await service.getAllResponses();

      expect(mockRepository.find).toHaveBeenCalledWith(
        expect.objectContaining({
          take: 100,
        }),
      );
    });

    it('should order by timestamp descending', async () => {
      mockRepository.find?.mockResolvedValue([]);

      await service.getAllResponses();

      expect(mockRepository.find).toHaveBeenCalledWith(
        expect.objectContaining({
          order: { timestamp: 'DESC' },
        }),
      );
    });
  });

  describe('triggerPing', () => {
    it('should call pingHttBin when triggered manually', async () => {
      const mockResponse: HttpResponse = {
        id: 1,
        requestPayload: '{}',
        responseData: '{}',
        statusCode: 200,
        responseTime: 100,
        timestamp: new Date(),
      };

      const pingHttBinSpy = jest
        .spyOn(service, 'pingHttBin')
        .mockResolvedValue(mockResponse);

      const result = await service.triggerPing();

      expect(pingHttBinSpy).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockResponse);

      pingHttBinSpy.mockRestore();
    });
  });
});
