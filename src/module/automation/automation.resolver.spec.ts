import { Test, TestingModule } from '@nestjs/testing';
import { AutomationResolver } from './automation.resolver';
import { AutomationService } from './automation.service';

describe('AutomationResolver', () => {
  let resolver: AutomationResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AutomationResolver, AutomationService],
    }).compile();

    resolver = module.get<AutomationResolver>(AutomationResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
