import { IsString } from 'class-validator';
import { Venue } from '../../entities';

/**
 * DTO for editing an event.
 *
 * @swagger
 * components:
 *   schemas:
 *     EditEventDto:
 *       type: object
 *       required:
 *         - name
 *         - description
 *         - startedAt
 *         - endedAt
 *         - venue
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the event.
 *         description:
 *           type: string
 *           description: A description of the event.
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
 *           description: The venue where the event is held.
 */

export class EditEventDto {
  @IsString()
  name!: string;

  @IsString()
  description!: string;

  startedAt!: Date;

  endedAt!: Date;

  venue!: Venue;
}
