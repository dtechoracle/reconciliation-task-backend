import { Test, TestingModule } from '@nestjs/testing';
import { ReconcileController } from './reconcile.controller';

describe('ReconcileController', () => {
  let controller: ReconcileController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReconcileController],
    }).compile();

    controller = module.get<ReconcileController>(ReconcileController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
