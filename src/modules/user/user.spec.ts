import request from 'supertest';
import { Repository } from 'typeorm';

import { User } from '@entities/user.entity';
import { INestApplication } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common/pipes';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { UserModule } from './user.module';
import { UserService } from './user.service';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let userRepository: Repository<User>;

  const MOCK_USERS = [
    {
      id: 1,
      username: 'test1',
      password: 'test123456',
    },
    {
      id: 2,
      username: 'test2',
      password: 'test123456',
    },
    {
      id: 3,
      username: 'test3',
      password: 'test123456',
    },
  ];

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        UserModule,
        TypeOrmModule.forRoot({
          type: 'better-sqlite3',
          database: ':memory:',
          dropSchema: true,
          entities: [User],
          logging: false,
          synchronize: true,
        }),
        TypeOrmModule.forFeature([User]),
      ],
      providers: [UserService],
    }).compile();

    app = moduleFixture.createNestApplication();

    userRepository = app.get(getRepositoryToken(User));
    const usersArray = userRepository.create(MOCK_USERS);
    await userRepository.save(usersArray);

    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET', () => {
    it('Should be return array users', async () => {
      const response = await request(app.getHttpServer()).get('/user');
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveLength(3);
      response.body.forEach((user: User, index: number) => {
        expect(user.username).toEqual(MOCK_USERS[index].username);
      });
    });
  });

  describe('POST', () => {
    it('Should be create a user', async () => {
      const createUserDto: CreateUserDto = {
        username: 'test',
        password: 'test123',
      };

      const response = await request(app.getHttpServer())
        .post('/user')
        .send(createUserDto);

      expect(response.statusCode).toBe(201);
      expect(response.body).toEqual({
        id: MOCK_USERS.length + 1,
        username: createUserDto.username,
      });
    });

    it('Should be return error when create a user with same username', async () => {
      const createUserDto: CreateUserDto = {
        username: 'test1',
        password: 'test123',
      };

      const response = await request(app.getHttpServer())
        .post('/user')
        .send(createUserDto);

      expect(response.statusCode).toBe(500);
    });

    it('Should be return error when create a user with empty username', async () => {
      const createUserDto: CreateUserDto = {
        username: '',
        password: 'test123',
      };

      const response = await request(app.getHttpServer())
        .post('/user')
        .send(createUserDto);

      expect(response.statusCode).toBe(400);
    });
  });
});
