import {
  INestApplication,
  NotFoundException,
  ValidationPipe,
} from '@nestjs/common';
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
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
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

  it('Should be defined', () => {
    expect(userController).toBeDefined();
    expect(userService).toBeDefined();
  });

  describe('Create', () => {
    it('Should create a user', async () => {
      jest.spyOn(userService, 'create').mockResolvedValueOnce(Mock_User);

      const result = await userController.create(Mock_Create_User_Dto);
      expect(result).toBe(Mock_User);
    });
  });

  describe('FindAll', () => {
    it('Should return an array of users', async () => {
      jest.spyOn(userService, 'findAll').mockResolvedValueOnce([Mock_User]);

      const result = await userController.findAll();
      expect(result).toEqual([Mock_User]);
    });
  });

  describe('FindOneById', () => {
    it('Should return a user', async () => {
      jest.spyOn(userService, 'findOne').mockResolvedValueOnce(Mock_User);

      const result = await userController.findOne(1);
      expect(result).toEqual(Mock_User);
    });

    it('Should be NotFoundException', async () => {
      jest
        .spyOn(userService, 'findOne')
        .mockRejectedValueOnce(new NotFoundException());

      try {
        const result = await userController.findOne(1);
        expect(result).not.toBeDefined();
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('Update', () => {
    it('Should update a user', async () => {
      const successReturn = { message: 'User updated successfully.' };

      jest.spyOn(userService, 'findOne').mockResolvedValueOnce(Mock_User);

      jest.spyOn(userService, 'update').mockResolvedValueOnce(successReturn);

      const result = await userController.update(1, Mock_Create_User_Dto);
      expect(result).toEqual(successReturn);
    });

    it('Should be NotFoundException', async () => {
      jest
        .spyOn(userService, 'findOne')
        .mockRejectedValueOnce(new NotFoundException());

      try {
        const result = await userController.update(1, Mock_Create_User_Dto);
        expect(result).not.toBeDefined();
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });
});
