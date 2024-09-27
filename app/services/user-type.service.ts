import { UserType } from '../entities';
import { injectable } from 'inversify';
import {
  EntityManager,
  EntityRepository,
  MikroORM,
} from '@mikro-orm/postgresql';

import { predefinedUserTypes } from '../entities';

@injectable()
export class UserTypeService {
  constructor(
    private readonly orm: MikroORM,
    private readonly em: EntityManager,
    private readonly userTypeRepository: EntityRepository<UserType>
  ) {
    this.createPredefinedUserTypes();
  }

  async createPredefinedUserTypes() {
    const emFork = this.em.fork();
    const userTypes = await emFork.find(UserType, {});

    for (const predefinedUserType of predefinedUserTypes) {
      if (!userTypes.some((userType) => userType.name === predefinedUserType)) {
        const userType = new UserType(predefinedUserType);
        await emFork.persistAndFlush(userType);
      }
    }
  }

  public async createUserType(name: string): Promise<UserType> {
    const userType = new UserType(name);
    await this.em.persistAndFlush(userType);
    return userType;
  }

  public async getUserTypes(): Promise<UserType[]> {
    return this.userTypeRepository.findAll({
      orderBy: { id: 'asc' },
    });
  }

  public async getById(id: number): Promise<UserType> {
    return this.userTypeRepository.findOneOrFail(id);
  }

  public async updateById(id: number, name: string): Promise<UserType> {
    const userType = await this.userTypeRepository.findOneOrFail(id);
    userType.name = name;
    await this.em.persistAndFlush(userType);
    return userType;
  }

  public async deleteById(id: number): Promise<number> {
    return this.userTypeRepository.nativeDelete({ id });
  }
}
