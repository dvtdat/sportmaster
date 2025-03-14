import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Event, User } from '../../entities';

/**
 * DTO for creating a transaction.
 *
 * @swagger
 * components:
 *   schemas:
 *     CreateTransactionDto:
 *       type: object
 *       required:
 *         - event
 *         - description
 *         - amount
 *         - toUser
 *         - fromUser
 *       properties:
 *         event:
 *           $ref: '#/components/schemas/Event'
 *           description: The event associated with the transaction.
 *         description:
 *           type: string
 *           description: A description of the transaction.
 *         amount:
 *           type: number
 *           description: The amount of the transaction.
 *         toUser:
 *           $ref: '#/components/schemas/User'
 *           description: The user receiving the transaction.
 *         fromUser:
 *           $ref: '#/components/schemas/User'
 *           description: The user initiating the transaction.
 */
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
