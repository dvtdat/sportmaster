import { Router } from 'express';
import { inject, injectable } from 'inversify';
import { UserService, UserTypeService } from '../services';
import { Request, Response } from 'express';

import { predefinedUserTypes } from '../entities';

@injectable()
export class UserTypeController {
  public readonly router = Router();
  constructor(
    @inject('UserService') private userService: UserService,
    @inject('UserTypeService') private userTypeService: UserTypeService
  ) {
    /**
     * @swagger
     * /user_types:
     *   get:
     *     summary: Retrieve a list of user types
     *     tags: [UserType]
     *     responses:
     *       200:
     *         description: A list of user types
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/UserType'
     */
    this.router.get('/', this.getAll.bind(this));

    /**
     * @swagger
     * /user_types/{id}:
     *   get:
     *     summary: Retrieve a user type by ID
     *     tags: [UserType]
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: string
     *         required: true
     *         description: The user type ID
     *     responses:
     *       200:
     *         description: A user type object
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/UserType'
     *       404:
     *         description: User type not found
     */
    this.router.get('/:id', this.getById.bind(this));

    /**
     * @swagger
     * /user_types:
     *   post:
     *     summary: Create a new user type
     *     tags: [UserType]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               name:
     *                 type: string
     *     responses:
     *       200:
     *         description: The created user type
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/UserType'
     */
    this.router.post('/', this.create.bind(this));

    /**
     * @swagger
     * /user_types/{id}:
     *   patch:
     *     summary: Update a user type by ID
     *     tags: [UserType]
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: string
     *         required: true
     *         description: The user type ID
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               name:
     *                 type: string
     *     responses:
     *       200:
     *         description: The updated user type
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/UserType'
     *       404:
     *         description: User type not found
     */
    this.router.patch('/:id', this.update.bind(this));

    /**
     * @swagger
     * /user_types/{id}:
     *   delete:
     *     summary: Delete a user type by ID
     *     tags: [UserType]
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: string
     *         required: true
     *         description: The user type ID
     *     responses:
     *       200:
     *         description: The deleted user type
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/UserType'
     *       404:
     *         description: User type not found
     */
    this.router.delete('/:id', this.delete.bind(this));
  }

  async getAll(req: Request, res: Response) {
    try {
      const userTypes = await this.userTypeService.getUserTypes();
      res.json(userTypes);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const userType = await this.userTypeService.getById(
        parseInt(req.params.id)
      );
      res.json(userType);
    } catch (error) {
      res.status(400).json({ message: error });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const userType = await this.userTypeService.createUserType(
        req.body.name as string
      );
      const { users, ...userTypeWithoutUsers } = userType;
      res.json(userTypeWithoutUsers);
    } catch (error) {
      res.status(400).json({ message: error });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const userType = await this.userTypeService.updateById(
        parseInt(req.params.id),
        req.body.name as string
      );
      res.json(userType);
    } catch (error) {
      res.status(400).json({ message: error });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const usedByUsers = await this.userService.getUserByUserTypeId(
        parseInt(req.params.id)
      );

      if (usedByUsers.length > 0) {
        res.status(400).json({
          message: 'User type is being assigned to one or more users',
          users: usedByUsers,
        });
        return;
      }

      const userType = await this.userTypeService.getById(
        parseInt(req.params.id)
      );

      if (predefinedUserTypes.includes(userType.name)) {
        res
          .status(400)
          .json({ message: 'Predefined user types cannot be deleted' });
        return;
      }

      await this.userTypeService.deleteById(parseInt(req.params.id));

      res.json(userType);
    } catch (error) {
      res.status(400).json({ message: error });
    }
  }
}
