import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('returns a healthy API status', () => {
      expect(appController.getHealth()).toEqual({
        status: 'ok',
        service: 'sri-lanka-destination-explorer-api',
      });
    });
  });
});
