import { Test, TestingModule } from '@nestjs/testing';

import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('POST', () => {
    it('should create a user', async () => {
      const user = {
        name: 'John Doe',
      };

      jest.spyOn(service, 'create').mockReturnValueOnce(user as never);

      expect(await controller.create(user)).toBe(user);
    });
  });
});
