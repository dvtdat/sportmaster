import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Event, User } from '../../entities';

export class CreateTransactionDto {
  @IsNotEmpty()
  event!: Event;

  @IsString()
  description!: string;

  @IsNumber()
  amount!: number;

  @IsNotEmpty()
  toUser!: User;

  @IsNotEmpty()
  fromUser!: User;
}
