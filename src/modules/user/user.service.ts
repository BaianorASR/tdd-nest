import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@entities/index';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const user = this.userRepository.create(createUserDto);
      return await this.userRepository.save(user);
    } catch (error) {
      throw error;
    }
  }

  async findAll(): Promise<User[]> {
    try {
      const users = await this.userRepository.find();
      return users;
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: number): Promise<User> {
    try {
      const user = await this.userRepository.findOneBy({ id });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      return user;
    } catch (error) {
      throw error;
    }
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<{ message: string }> {
    try {
      await this.findOne(id);
      await this.userRepository.update(id, updateUserDto);

      return { message: 'User updated successfully.' };
    } catch (error) {
      throw error;
    }
  }

  async remove(id: number): Promise<{ message: string }> {
    try {
      await this.findOne(id);
      const a = await this.userRepository.delete(id);

      return { message: 'User deleted successfully.' };
    } catch (error) {
      throw error;
    }
  }
}
