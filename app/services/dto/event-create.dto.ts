import { IsString, IsNotEmpty } from 'class-validator';
import { Venue } from '../../entities';

/**
 * DTO for creating an event.
 *
 * @swagger
 * components:
 *   schemas:
 *     CreateEventDto:
 *       type: object
 *       required:
 *         - name
 *         - startedAt
 *         - endedAt
 *         - venue
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the event.
 *         description:
 *           type: string
 *           description: A brief description of the event.
 *         startedAt:
 *           type: string
 *           format: date-time
 *           description: The start date and time of the event.
 *         endedAt:
 *           type: string
 *           format: date-time
 *           description: The end date and time of the event.
 *         venue:
 *           $ref: '#/components/schemas/Venue'
 *           description: The venue where the event will take place.
 */
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
