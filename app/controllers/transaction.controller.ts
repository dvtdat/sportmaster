import { Router } from 'express';
import { inject, injectable } from 'inversify';
import { Transaction } from '../entities';
import { TransactionService, EventService, UserService } from '../services';
import { Request, Response } from 'express';

import { CreateTransactionDto, EditTransactionDto } from '../services/dto';

@injectable()
export class TransactionController {
  public readonly router = Router();

  constructor(
    @inject('TransactionService')
    private transactionService: TransactionService,
    @inject('EventService') private eventService: EventService,
    @inject('UserService') private userService: UserService
  ) {
    this.router.get('/', this.getAll.bind(this));
    this.router.get('/:id', this.getById.bind(this));
    this.router.post('/', this.create.bind(this));
    this.router.patch('/:id', this.update.bind(this));
    this.router.post('/update', this.updateByIds.bind(this));
    this.router.post('/split', this.splitBill.bind(this));
    this.router.delete('/:id', this.delete.bind(this));
  }

  async getAll(req: Request, res: Response) {
    try {
      const filters: Partial<Transaction> = {};

      const eventId = req.query.eventId as string;
      const completed = req.query.completed as string;
      const toUserId = req.query.toUserId as string;
      const fromUserId = req.query.fromUserId as string;

      if (eventId) {
        const event = await this.eventService.getEventById(parseInt(eventId));
        filters.event = event;
      }

      if (completed) {
        filters.completed = completed === 'true';
      }

      if (toUserId) {
        const toUser = await this.userService.getUserById(parseInt(toUserId));
        filters.toUser = toUser;
      }

      if (fromUserId) {
        const fromUser = await this.userService.getUserById(
          parseInt(fromUserId)
        );
        filters.fromUser = fromUser;
      }

      const transactions = await this.transactionService.getTransactions(
        filters
      );
      res.json(transactions);
    } catch (error) {
      res.status(400).json({ message: error });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const transaction = await this.transactionService.getTransactionById(
        parseInt(req.params.id)
      );
      res.json(transaction);
    } catch (error) {
      res.status(400).json({ message: error });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const eventId = req.body.eventId;
      const description = req.body.description;
      const toUserId = req.body.toUserId;
      const fromUserId = req.body.fromUserId;
      const amount = req.body.amount;

      const event = await this.eventService.getEventById(eventId);
      const toUser = await this.userService.getUserById(toUserId);
      const fromUser = await this.userService.getUserById(fromUserId);

      const createTransactionDto: CreateTransactionDto = {
        event: event,
        description: description,
        amount: amount || 0,
        toUser: toUser,
        fromUser: fromUser,
      };

      const transaction = await this.transactionService.createTransaction(
        createTransactionDto
      );
      res.json(transaction);
    } catch (error) {
      res.status(400).json({ message: error });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const transaction = await this.transactionService.getTransactionById(
        parseInt(req.params.id)
      );

      const description = req.body.description || transaction.description;
      const amount = req.body.amount || transaction.amount;
      const completed = req.body.completed || transaction.completed;
      const toUserId = req.body.toUserId || transaction.toUser.id;
      const fromUserId = req.body.fromUserId || transaction.fromUser.id;

      const toUser = await this.userService.getUserById(toUserId);
      const fromUser = await this.userService.getUserById(fromUserId);

      const editTransactionDto: EditTransactionDto = {
        event: transaction.event,
        description: description,
        amount: amount,
        completed: completed,
        toUser: toUser,
        fromUser: fromUser,
      };

      const updatedTransaction = await this.transactionService.updateById(
        parseInt(req.params.id),
        editTransactionDto
      );
      res.json(updatedTransaction);
    } catch (error) {
      res.status(400).json({ message: error });
    }
  }

  async updateByIds(req: Request, res: Response) {
    try {
      const transactionIds = req.body.transactionIds;
      const description = req.body.description;
      const amount = req.body.amount;
      const completed = req.body.completed;

      if (!transactionIds) {
        throw new Error('transactionIds is required');
      }

      const parsedTransactionIds = transactionIds.map((transactionId: string) =>
        parseInt(transactionId)
      );

      const transactions = await Promise.all(
        parsedTransactionIds.map(async (transactionId: number) => {
          const transaction = await this.transactionService.getTransactionById(
            transactionId
          );
          const editTransactionDto: EditTransactionDto = {
            event: transaction.event,
            description: description || transaction.description,
            amount: amount || transaction.amount,
            completed:
              completed !== undefined ? completed : transaction.completed,
            toUser: transaction.toUser,
            fromUser: transaction.fromUser,
          };
          return this.transactionService.updateById(
            transactionId,
            editTransactionDto
          );
        })
      );
      res.json(transactions);
    } catch (error) {
      res.status(400).json({ message: error });
    }
  }

  async splitBill(req: Request, res: Response) {
    try {
      const eventId = req.body.eventId;
      const toUserId = req.body.toUserId;

      const event = await this.eventService.getEventById(eventId);
      const toUser = await this.userService.getUserById(toUserId);
      const fromUsers = event.attendees;

      const totalAmount = await this.transactionService.getTotalAmountByEvent(
        event
      );

      const amountPerPerson =
        Math.round(totalAmount / fromUsers.length / 1000) * 1000;

      const transactions = fromUsers.map((fromUser) => {
        return {
          event: event,
          description: `Split bill for ${event.name}`,
          amount: amountPerPerson,
          toUser: toUser,
          fromUser: fromUser,
        };
      });

      await Promise.all(
        transactions.map(async (transaction) => {
          await this.transactionService.createTransaction(transaction);
        })
      );

      res.json(transactions);
    } catch (error) {
      res.status(400).json({ message: error });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      await this.transactionService.deleteById(parseInt(req.params.id));
      res.json({ message: 'Transaction deleted successfully' });
    } catch (error) {
      res.status(400).json({ message: error });
    }
  }
}
