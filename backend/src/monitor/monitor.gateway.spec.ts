import { Test, TestingModule } from '@nestjs/testing';
import { MonitorGateway } from './monitor.gateway';

describe('MonitorGateway', () => {
  let gateway: MonitorGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MonitorGateway],
    }).compile();

    gateway = module.get<MonitorGateway>(MonitorGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
