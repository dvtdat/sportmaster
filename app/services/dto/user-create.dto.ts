import { IsString, IsNotEmpty } from 'class-validator';
import { UserType } from '../../entities';
export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsNotEmpty()
  userType!: UserType;
}
