import { IsString, IsNotEmpty } from 'class-validator';
import { UserType } from '../../entities';
/**
 * DTO for creating a new user.
 *
 * @swagger
 * components:
 *   schemas:
 *     CreateUserDto:
 *       type: object
 *       required:
 *         - name
 *         - userType
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the user.
 *         userType:
 *           type: string
 *           description: The type of the user.
 *       example:
 *         name: John Doe
 *         userType: admin
 */
export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsNotEmpty()
  userType!: UserType;
}
