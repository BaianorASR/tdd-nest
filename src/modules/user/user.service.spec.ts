import { Repository } from 'typeorm';

import { User } from '@entities/index';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Mock_User } from '@test/mocks/index';
import { TypeOrmRepositoryMock } from '@test/utils/typeorm-repository-mock.util';

import { UserService } from './user.service';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useClass: TypeOrmRepositoryMock,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
    expect(userRepository).toBeDefined();
  });

  describe('Create', () => {
    it('should create a user', async () => {
      const user = Mock_User;

      jest
        .spyOn(userRepository, 'save')
        .mockReturnValueOnce(Promise.resolve(user));

      const result = await userService.create(user);
      expect(result).toBe(user);
      expect(userRepository.create).toHaveBeenCalledWith(user);
    });
  });

  describe('FindAll', () => {
    it('should return an array of users', async () => {
      const users = [Mock_User];

      jest
        .spyOn(userRepository, 'find')
        .mockReturnValueOnce(Promise.resolve(users));

      const result = await userService.findAll();
      expect(result).toBe(users);
      expect(userRepository.find).toHaveBeenCalled();
    });
  });

  describe('FindOne', () => {
    it('should return a user', async () => {
      const user = Mock_User;

      jest
        .spyOn(userRepository, 'findOneBy')
        .mockReturnValueOnce(Promise.resolve(user));

      const result = await userService.findOne(user.id);
      expect(result).toBe(user);
      expect(userRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });
  });
});
