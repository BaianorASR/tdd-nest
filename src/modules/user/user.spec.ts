import request from 'supertest';

import { User } from '@entities/user.entity';
import { INestApplication } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common/pipes';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { UserModule } from './user.module';
import { UserService } from './user.service';

describe('AppController (e2e)', () => {
  let app: INestApplication;

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
      expect(response.body).toEqual([]);
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
        id: 1,
        username: createUserDto.username,
      });

      const responseGet = await request(app.getHttpServer()).get('/user');
      expect(responseGet.statusCode).toBe(200);
      expect(responseGet.body).toEqual([response.body]);
    });

    it('Should be return error when create a user with same username', async () => {
      const createUserDto: CreateUserDto = {
        username: 'test',
        password: 'test123',
      };

      const response = await request(app.getHttpServer())
        .post('/user')
        .send(createUserDto);

      expect(response.statusCode).toBe(201);
      expect(response.body).toEqual({
        id: 1,
        username: createUserDto.username,
      });

      const response2 = await request(app.getHttpServer())
        .post('/user')
        .send(createUserDto);

      expect(response2.statusCode).toBe(500);
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
