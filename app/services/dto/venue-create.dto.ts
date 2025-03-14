import { IsString, IsNotEmpty } from 'class-validator';

/**
 * DTO for creating a new venue.
 *
 * @swagger
 * components:
 *   schemas:
 *     CreateVenueDto:
 *       type: object
 *       required:
 *         - name
 *         - address
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
export class CreateVenueDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  address!: string;

  @IsString()
  phone!: string;
}
