import { Repository } from 'typeorm';

import { User } from '@entities/index';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Mock_User } from '@test/mocks/index';
import { TypeOrmRepositoryMock } from '@test/utils/typeorm-repository-mock.util';

import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
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

    service = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(userRepository).toBeDefined();
  });

  describe('Create', () => {
    it('should create a user', async () => {
      const user = Mock_User;

      jest
        .spyOn(userRepository, 'save')
        .mockReturnValueOnce(Promise.resolve(user));

      const result = await service.create(user);
      expect(result).toBe(user);
      expect(userRepository.create).toHaveBeenCalledWith(user);
    });
  });
});
