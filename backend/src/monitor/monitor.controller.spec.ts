import { Test, TestingModule } from '@nestjs/testing';
import { MonitorController } from './monitor.controller';
import { MonitorService } from './monitor.service';
import { Response as HttpResponse } from './entities/response.entity';

describe('MonitorController', () => {
  let controller: MonitorController;
  let mockMonitorService: Partial<MonitorService>;

  beforeEach(async () => {
    mockMonitorService = {
      getAllResponses: jest.fn(),
      triggerPing: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [MonitorController],
      providers: [
        {
          provide: MonitorService,
          useValue: mockMonitorService,
        },
      ],
    }).compile();

    controller = module.get<MonitorController>(MonitorController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllResponses', () => {
    it('should return an array of responses', async () => {
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
      ];

      (mockMonitorService.getAllResponses as jest.Mock).mockResolvedValue(
        mockResponses,
      );

      const result = await controller.getAllResponses();

      expect(mockMonitorService.getAllResponses).toHaveBeenCalled();
      expect(result).toEqual(mockResponses);
      expect(result).toHaveLength(2);
    });

    it('should call service getAllResponses method', async () => {
      (mockMonitorService.getAllResponses as jest.Mock).mockResolvedValue([]);

      await controller.getAllResponses();

      expect(mockMonitorService.getAllResponses).toHaveBeenCalledTimes(1);
    });
  });

  describe('triggerPing', () => {
    it('should trigger a ping and return the response', async () => {
      const mockResponse: HttpResponse = {
        id: 1,
        requestPayload: '{}',
        responseData: '{}',
        statusCode: 200,
        responseTime: 100,
        timestamp: new Date(),
      };

      (mockMonitorService.triggerPing as jest.Mock).mockResolvedValue(
        mockResponse,
      );

      const result = await controller.triggerPing();

      expect(mockMonitorService.triggerPing).toHaveBeenCalled();
      expect(result).toEqual(mockResponse);
    });

    it('should call service triggerPing method', async () => {
      (mockMonitorService.triggerPing as jest.Mock).mockResolvedValue(null);

      await controller.triggerPing();

      expect(mockMonitorService.triggerPing).toHaveBeenCalledTimes(1);
    });
  });
});
