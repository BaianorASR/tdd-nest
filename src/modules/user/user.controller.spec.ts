import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Mock_Create_User_Dto, Mock_User } from '@test/mocks/user.mock';

import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let app: INestApplication;
  let userController: UserController;
  let userService: UserService;

  const mockUserService = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    userController = app.get<UserController>(UserController);
    userService = app.get<UserService>(UserService);

    await app.init();
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
    expect(userService).toBeDefined();
  });

  describe('Create', () => {
    it('should create a user', async () => {
      jest
        .spyOn(userService, 'create')
        .mockReturnValueOnce(Promise.resolve(Mock_User));

      const result = await userController.create(Mock_Create_User_Dto);
      expect(result).toBe(Mock_User);
    });
  });
});
