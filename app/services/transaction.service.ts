import { Transaction } from '../entities';
import { injectable } from 'inversify';
import {
  EntityManager,
  EntityRepository,
  MikroORM,
} from '@mikro-orm/postgresql';
import { Event } from '../entities';
import { CreateTransactionDto, EditTransactionDto } from './dto';

@injectable()
export class TransactionService {
  constructor(
    private readonly orm: MikroORM,
    private readonly em: EntityManager,
    private readonly transactionRepository: EntityRepository<Transaction>
  ) {}

  public async createTransaction(
    createTransactionDto: CreateTransactionDto
  ): Promise<Transaction> {
    const transaction = new Transaction(
      createTransactionDto.event,
      createTransactionDto.description,
      createTransactionDto.amount,
      createTransactionDto.toUser,
      createTransactionDto.fromUser
    );
    this.em.persistAndFlush(transaction);
    return transaction;
  }

  public async getTransactions(
    filters: Partial<Event>
  ): Promise<Transaction[]> {
    return this.transactionRepository.find(filters, {
      orderBy: { id: 'asc' },
      populate: ['event', 'toUser', 'fromUser'],
    });
  }

  public async getTransactionById(id: number): Promise<Transaction> {
    return this.transactionRepository.findOneOrFail(id, {
      populate: ['event', 'toUser', 'fromUser'],
    });
  }

  public async updateById(
    id: number,
    editTransactionDto: EditTransactionDto
  ): Promise<Transaction> {
    const transaction = await this.transactionRepository.findOneOrFail(id, {
      populate: ['event', 'toUser', 'fromUser'],
    });

    transaction.event = editTransactionDto.event;
    transaction.description = editTransactionDto.description;
    transaction.amount = editTransactionDto.amount;
    transaction.completed = editTransactionDto.completed;
    transaction.toUser = editTransactionDto.toUser;
    transaction.fromUser = editTransactionDto.fromUser;

    await this.em.persistAndFlush(transaction);
    return transaction;
  }

  public async deleteById(id: number): Promise<number> {
    return this.transactionRepository.nativeDelete({ id });
  }
  public async getTotalAmountByEvent(event: Event): Promise<number> {
    const transactions = await this.transactionRepository.find(
      { event },
      { populate: ['toUser.userType'] }
    );

    return transactions.reduce((acc, transaction) => {
      const isVendor = transaction.toUser.userType.name === 'Vendor';
      return acc + (isVendor ? transaction.amount : 0);
    }, 0);
  }
}
