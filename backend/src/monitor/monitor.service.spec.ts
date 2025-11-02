import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MonitorService } from './monitor.service';
import { Response as HttpResponse } from './entities/response.entity';
import { MonitorGateway } from './monitor.gateway';
import { ObjectLiteral, Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';

type MockRepository<T extends ObjectLiteral = any> = Partial<
  Record<keyof Repository<T>, jest.Mock>
>;
type MockGateway = Partial<Record<keyof MonitorGateway, jest.Mock>>;

describe('MonitorService', () => {
  let service: MonitorService;
  let mockRepository: MockRepository<HttpResponse>;
  let mockGateway: MockGateway;

  beforeEach(async () => {
    mockRepository = {
      save: jest.fn(),
      find: jest.fn(),
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
          useValue: {
            post: jest.fn(),
          },
        },
        {
          provide: MonitorGateway,
          useValue: mockGateway,
        },
      ],
    }).compile();

    service = module.get<MonitorService>(MonitorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should save response to database', async () => {
    const mockResponse: Partial<HttpResponse> = {
      id: 1,
      requestPayload: '{}',
      responseData: '{}',
      statusCode: 200,
      timestamp: new Date(),
    };

    mockRepository.save?.mockResolvedValue(mockResponse as HttpResponse);

    await service.pingHttBin();

    expect(mockRepository.save).toHaveBeenCalled();
    expect(mockGateway.broadcastNewResponse).toHaveBeenCalled();
  });

  it('should retrieve all responses', async () => {
    const mockResponses: Partial<HttpResponse>[] = [
      { id: 1, statusCode: 200, timestamp: new Date() },
      { id: 2, statusCode: 200, timestamp: new Date() },
    ];

    mockRepository.find?.mockResolvedValue(mockResponses);

    const result = await service.getAllResponses();

    expect(result).toEqual(mockResponses);
    expect(mockRepository.find).toHaveBeenCalled();
  });
});
