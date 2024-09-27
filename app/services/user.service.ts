import { User } from '../entities';
import { injectable } from 'inversify';
import {
  EntityManager,
  EntityRepository,
  MikroORM,
} from '@mikro-orm/postgresql';
import { CreateUserDto, EditUserDto } from './dto';

@injectable()
export class UserService {
  constructor(
    private readonly orm: MikroORM,
    private readonly em: EntityManager,
    private readonly userRepository: EntityRepository<User>
  ) {}

  public async createUser(createUserDto: CreateUserDto) {
    const user = new User(createUserDto.name, createUserDto.userType);
    await this.em.persistAndFlush(user);
    return user;
  }

  public async getUsers(filters: Partial<User>): Promise<User[]> {
    return this.userRepository.find(filters, {
      orderBy: { id: 'asc' },
      populate: ['userType'],
    });
  }

  public async getUserById(id: number): Promise<User> {
    return this.userRepository.findOneOrFail(id);
  }

  public async getUserByUserTypeId(userTypeId: number): Promise<User[]> {
    return this.userRepository.find({ userType: userTypeId });
  }

  public async updateById(id: number, editUserDto: EditUserDto): Promise<User> {
    const user = await this.userRepository.findOneOrFail(id);
    user.name = editUserDto.name;
    user.userType = editUserDto.userType;
    await this.em.persistAndFlush(user);
    return user;
  }

  public async deleteById(id: number): Promise<number> {
    return this.userRepository.nativeDelete({ id });
  }
}
