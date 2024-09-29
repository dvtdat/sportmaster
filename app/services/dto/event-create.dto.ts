import { IsString, IsNotEmpty } from 'class-validator';
import { Venue } from '../../entities';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  description!: string;

  @IsNotEmpty()
  startedAt!: Date;

  @IsNotEmpty()
  endedAt!: Date;

  @IsNotEmpty()
  venue!: Venue;
}
