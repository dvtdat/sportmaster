import { IsString, IsBoolean, IsNotEmpty } from 'class-validator';
import { Event, User } from '../../entities';

export class EditTransactionDto {
  event!: Event;

  @IsString()
  description!: string;

  @IsNotEmpty()
  amount!: number;

  @IsBoolean()
  completed!: boolean;

  toUser!: User;

  fromUser!: User;
}
