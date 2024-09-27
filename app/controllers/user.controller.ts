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
    this.router.get('/', this.getAll.bind(this));
    this.router.get('/:id', this.getById.bind(this));
    this.router.post('/', this.create.bind(this));
    this.router.patch('/:id', this.update.bind(this));
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
      await this.userService.deleteById(parseInt(req.params.id));
      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      res.status(400).json({ message: error });
    }
  }
}
