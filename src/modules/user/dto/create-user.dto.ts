import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 120)
  username: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 30)
  password: string;
}
