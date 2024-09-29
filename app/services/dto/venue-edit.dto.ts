import { IsString } from 'class-validator';

export class EditVenueDto {
  @IsString()
  name!: string;

  @IsString()
  address!: string;

  @IsString()
  phone!: string;
}
