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
    this.router.get('/', this.getAll.bind(this));
    this.router.get('/:id', this.getById.bind(this));
    this.router.post('/', this.create.bind(this));
    this.router.patch('/:id', this.update.bind(this));
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
      res.json(userType);
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

      res.json({ message: 'User type deleted successfully' });
    } catch (error) {
      res.status(400).json({ message: error });
    }
  }
}
