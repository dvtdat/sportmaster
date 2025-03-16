import { Router } from 'express';
import { inject, injectable } from 'inversify';
import { User } from '../entities';
import { UserService, UserTypeService } from '../services';
import { Request, Response } from 'express';

import { CreateUserDto, EditUserDto } from '../services/dto';
@injectable()
export class UserController {
  public readonly router = Router();

  constructor(
    @inject('UserService') private userService: UserService,
    @inject('UserTypeService') private userTypeService: UserTypeService
  ) {
    /**
     * @swagger
     * /users:
     *   get:
     *     summary: Retrieve a list of users
     *     tags: [Users]
     *     parameters:
     *       - in: query
     *         name: userTypeId
     *         schema:
     *           type: string
     *         description: The user type ID to filter users by
     *     responses:
     *       200:
     *         description: A list of users
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/User'
     *       400:
     *         description: Bad request
     */
    this.router.get('/', this.getAll.bind(this));

    /**
     * @swagger
     * /users/{id}:
     *   get:
     *     summary: Retrieve a user by ID
     *     tags: [Users]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: The user ID
     *     responses:
     *       200:
     *         description: A user object
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/User'
     *       400:
     *         description: Bad request
     */
    this.router.get('/:id', this.getById.bind(this));

    /**
     * @swagger
     * /users:
     *   post:
     *     summary: Create a new user
     *     tags: [Users]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               name:
     *                 type: string
     *               userTypeId:
     *                 type: integer
     *     responses:
     *       200:
     *         description: The created user
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/User'
     *       400:
     *         description: Bad request
     */
    this.router.post('/', this.create.bind(this));

    /**
     * @swagger
     * /users/{id}:
     *   patch:
     *     summary: Update a user by ID
     *     tags: [Users]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: The user ID
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               name:
     *                 type: string
     *               userTypeId:
     *                 type: integer
     *     responses:
     *       200:
     *         description: The updated user
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/User'
     *       400:
     *         description: Bad request
     */
    this.router.patch('/:id', this.update.bind(this));

    /**
     * @swagger
     * /users/{id}:
     *   delete:
     *     summary: Delete a user by ID
     *     tags: [Users]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: The user ID
     *     responses:
     *       200:
     *         description: The deleted user
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/User'
     *       400:
     *         description: Bad request
     */
    this.router.delete('/:id', this.delete.bind(this));
  }

  async getAll(req: Request, res: Response) {
    try {
      const filters: Partial<User> = {};

      const userTypeId = req.query.userTypeId as string;

      if (userTypeId) {
        const userType = await this.userTypeService.getById(
          parseInt(userTypeId)
        );
        filters.userType = userType;
      }

      const users = await this.userService.getUsers(filters);
      res.json(users);
    } catch (error) {
      res.status(400).json({ message: error });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const user = await this.userService.getUserById(parseInt(req.params.id));
      res.json(user);
    } catch (error) {
      res.status(400).json({ message: error });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const username = req.body.name;
      const userTypeId = req.body.userTypeId;

      const userType = await this.userTypeService.getById(userTypeId);

      const createUserDto: CreateUserDto = {
        name: username,
        userType: userType,
      };

      const user = await this.userService.createUser(createUserDto);
      res.json(user);
    } catch (error) {
      res.status(400).json({ message: error });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const user = await this.userService.getUserById(parseInt(req.params.id));

      const username = req.body.name || user.name;
      const userTypeId = req.body.userTypeId || user.userType.id;

      const userType = await this.userTypeService.getById(userTypeId);

      const editUserDto: EditUserDto = {
        name: username,
        userType: userType,
      };

      const updatedUser = await this.userService.updateById(
        parseInt(req.params.id),
        editUserDto
      );
      res.json(updatedUser);
    } catch (error) {
      res.status(400).json({ message: error });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const user = await this.userService.deleteById(parseInt(req.params.id));
      res.json(user);
    } catch (error) {
      res.status(400).json({ message: error });
    }
  }
}
