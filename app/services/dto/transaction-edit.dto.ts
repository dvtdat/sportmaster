import { IsString, IsBoolean, IsNotEmpty } from 'class-validator';
import { Event, User } from '../../entities';

/**
 * DTO for editing a transaction.
 *
 * @swagger
 * components:
 *   schemas:
 *     EditTransactionDto:
 *       type: object
 *       properties:
 *         event:
 *           $ref: '#/components/schemas/Event'
 *           description: The event associated with the transaction.
 *         description:
 *           type: string
 *           description: A brief description of the transaction.
 *         amount:
 *           type: number
 *           description: The amount involved in the transaction.
 *         completed:
 *           type: boolean
 *           description: Indicates whether the transaction is completed.
 *         toUser:
 *           $ref: '#/components/schemas/User'
 *           description: The user to whom the transaction is directed.
 *         fromUser:
 *           $ref: '#/components/schemas/User'
 *           description: The user from whom the transaction originates.
 */
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
