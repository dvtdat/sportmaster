import { IsString } from 'class-validator';
import { Venue } from '../../entities';

export class EditEventDto {
  @IsString()
  name!: string;

  @IsString()
  description!: string;

  startedAt!: Date;

  endedAt!: Date;

  venue!: Venue;
}
