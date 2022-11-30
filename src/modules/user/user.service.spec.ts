import { Repository, UpdateResult } from 'typeorm';

import { User } from '@entities/index';
import { NotFoundException } from '@nestjs/common';
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
    it('Should create a user', async () => {
      const user = Mock_User;

      jest.spyOn(userRepository, 'save').mockResolvedValueOnce(user);

      const result = await userService.create(user);
      expect(result).toBe(user);
      expect(userRepository.create).toHaveBeenCalledWith(user);
    });
  });

  describe('FindAll', () => {
    it('Should return an array of users', async () => {
      const users = [Mock_User];

      jest.spyOn(userRepository, 'find').mockResolvedValueOnce(users);

      const result = await userService.findAll();
      expect(result).toBe(users);
      expect(userRepository.find).toHaveBeenCalled();
    });
  });

  describe('FindOneById', () => {
    it('Should return a user', async () => {
      const user = Mock_User;

      jest.spyOn(userRepository, 'findOneBy').mockResolvedValueOnce(user);

      const result = await userService.findOne(user.id);
      expect(result).toBe(user);
      expect(userRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });

    it('Should be NotFoundException', async () => {
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValueOnce(null);

      try {
        const result = await userService.findOne(1);
        expect(result).not.toBeDefined();
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('Update', () => {
    it('Should be NotFoundException', async () => {
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValueOnce(null);

      try {
        const result = await userService.update(1, Mock_User);
        expect(result).not.toBeDefined();
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });

    it('Should update a user', async () => {
      const user = Mock_User;

      jest.spyOn(userRepository, 'findOneBy').mockResolvedValueOnce(user);

      jest
        .spyOn(userRepository, 'update')
        .mockResolvedValueOnce({ affected: 1 } as UpdateResult);
      const updateUserDto = {
        username: 'newUsername',
      };

      const result = await userService.update(1, updateUserDto);
      expect(result).toEqual({ message: 'User updated successfully.' });
    });
  });

  describe('Delete', () => {
    it('Should be NotFoundException', async () => {
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValueOnce(null);

      try {
        const result = await userService.remove(1);
        expect(result).not.toBeDefined();
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });

    it('Should delete a user', async () => {
      const user = Mock_User;

      jest.spyOn(userRepository, 'findOneBy').mockResolvedValueOnce(user);

      jest
        .spyOn(userRepository, 'delete')
        .mockResolvedValueOnce({ affected: 1, raw: [] });

      const result = await userService.remove(1);
      expect(result).toEqual({ message: 'User deleted successfully.' });
    });
  });
});
