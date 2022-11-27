import { plainToInstance } from 'class-transformer';

import { User } from '@entities/user.entity';

import { CreateUserDto } from '../../src/modules/user/dto/create-user.dto';

export const Mock_User = plainToInstance(User, {
  id: 1,
  username: 'test',
  password: 'test',
});

export const Mock_Create_User_Dto = plainToInstance(CreateUserDto, {
  username: 'test',
  password: 'test',
});
