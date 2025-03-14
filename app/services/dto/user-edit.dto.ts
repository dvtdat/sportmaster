import { IsString } from 'class-validator';
import { UserType } from '../../entities';

/**
 * DTO for editing a user.
 *
 * @swagger
 * components:
 *   schemas:
 *     EditUserDto:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the user.
 *         userType:
 *           $ref: '#/components/schemas/UserType'
 *           description: The type of the user.
 */
export class EditUserDto {
  @IsString()
  name!: string;

  userType!: UserType;
}
