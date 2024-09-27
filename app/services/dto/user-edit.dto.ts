import { IsString } from 'class-validator';
import { UserType } from '../../entities';

export class EditUserDto {
  @IsString()
  name!: string;

  userType!: UserType;
}
