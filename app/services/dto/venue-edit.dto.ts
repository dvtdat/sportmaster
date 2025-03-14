import { IsString } from 'class-validator';

/**
 * DTO for editing a venue.
 *
 * @swagger
 * components:
 *   schemas:
 *     EditVenueDto:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the venue.
 *         address:
 *           type: string
 *           description: The address of the venue.
 *         phone:
 *           type: string
 *           description: The phone number of the venue.
 */
export class EditVenueDto {
  @IsString()
  name!: string;

  @IsString()
  address!: string;

  @IsString()
  phone!: string;
}
