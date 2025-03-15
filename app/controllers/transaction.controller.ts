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
    /**
     * @swagger
     * /transactions:
     *   get:
     *     summary: Retrieve all transactions
     *     tags: [Transactions]
     *     parameters:
     *       - in: query
     *         name: eventId
     *         schema:
     *           type: integer
     *         required: false
     *         description: The ID of the event
     *       - in: query
     *         name: completed
     *         schema:
     *           type: boolean
     *         required: false
     *         description: Filter by completion status
     *       - in: query
     *         name: toUserId
     *         schema:
     *           type: integer
     *         required: false
     *         description: The ID of the recipient user
     *       - in: query
     *         name: fromUserId
     *         schema:
     *           type: integer
     *         required: false
     *         description: The ID of the sender user
     *     responses:
     *       200:
     *         description: A list of transactions
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Transaction'
     *       400:
     *         description: Bad request
     * components:
     *   schemas:
     *     EventSummary:
     *       allOf:
     *         - $ref: '#/components/schemas/BaseEntity'
     *       type: object
     *       properties:
     *         name:
     *           type: string
     *           description: The name of the event.
     *         description:
     *           type: string
     *           description: A brief description of the event.
     *         startedAt:
     *           type: string
     *           format: date-time
     *           description: The start date and time of the event.
     *         endedAt:
     *           type: string
     *           format: date-time
     *           description: The end date and time of the event.
     *         venue:
     *           $ref: '#/components/schemas/Venue'
     *           description: The venue where the event is held.
     *     Transaction:
     *       type: object
     *       allOf:
     *         - $ref: '#/components/schemas/BaseEntity'
     *       properties:
     *         event:
     *           $ref: '#/components/schemas/EventSummary'
     *         description:
     *           type: string
     *           maxLength: 1000
     *           nullable: true
     *         completed:
     *           type: boolean
     *         amount:
     *           required:
     *             - id
     *             - createdAt
     *             - updatedAt
     *             - name
     *             - userType
     *       required:
     *         - event
     *         - completed
     *         - amount
     *         - toUser
     *         - fromUser
     */
    this.router.get('/', this.getAll.bind(this));

    /**
     * @swagger
     * /transactions/{id}:
     *   get:
     *     summary: Retrieve a transaction by ID
     *     tags: [Transactions]
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: integer
     *         required: true
     *         description: The ID of the transaction
     *     responses:
     *       200:
     *         description: A transaction object
     *       400:
     *         description: Bad request
     */
    this.router.get('/:id', this.getById.bind(this));

    /**
     * @swagger
     * /transactions:
     *   post:
     *     summary: Create a new transaction
     *     tags: [Transactions]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               eventId:
     *                 type: integer
     *               description:
     *                 type: string
     *               toUserId:
     *                 type: integer
     *               fromUserId:
     *                 type: integer
     *               amount:
     *                 type: number
     *     responses:
     *       200:
     *         description: The created transaction
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Transaction'
     *       400:
     *         description: Bad request
     */
    this.router.post('/', this.create.bind(this));

    /**
     * @swagger
     * /transactions:
     *   post:
     *     summary: Create a new transaction
     *     tags: [Transactions]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               eventId:
     *                 type: integer
     *               description:
     *                 type: string
     *               toUserId:
     *                 type: integer
     *               fromUserId:
     *                 type: integer
     *               amount:
     *                 type: number
     *     responses:
     *       200:
     *         description: The created transaction
     *       400:
     *         description: Bad request
     */
    this.router.post('/', this.create.bind(this));

    /**
     * @swagger
     * /transactions/{id}:
     *   patch:
     *     summary: Update a transaction by ID
     *     tags: [Transactions]
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: integer
     *         required: true
     *         description: The ID of the transaction
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               description:
     *                 type: string
     *               amount:
     *                 type: number
     *               completed:
     *                 type: boolean
     *               toUserId:
     *                 type: integer
     *               fromUserId:
     *                 type: integer
     *     responses:
     *       200:
     *         description: The updated transaction
     *       400:
     *         description: Bad request
     */
    this.router.patch('/:id', this.update.bind(this));

    /**
     * @swagger
     * /transactions/update:
     *   post:
     *     summary: Update multiple transactions by IDs
     *     tags: [Transactions]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               transactionIds:
     *                 type: array
     *                 items:
     *                   type: integer
     *               description:
     *                 type: string
     *               amount:
     *                 type: number
     *               completed:
     *                 type: boolean
     *     responses:
     *       200:
     *         description: The updated transactions
     *       400:
     *         description: Bad request
     */
    this.router.post('/update', this.updateByIds.bind(this));

    /**
     * @swagger
     * /transactions/split:
     *   post:
     *     summary: Split a bill among event attendees
     *     tags: [Transactions]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               eventId:
     *                 type: integer
     *               toUserId:
     *                 type: integer
     *     responses:
     *       200:
     *         description: The created transactions
     *       400:
     *         description: Bad request
     */
    this.router.post('/split', this.splitBill.bind(this));

    /**
     * @swagger
     * /transactions/{id}:
     *   delete:
     *     summary: Delete a transaction by ID
     *     tags: [Transactions]
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: integer
     *         required: true
     *         description: The ID of the transaction
     *     responses:
     *       200:
     *         description: Transaction deleted successfully
     *       400:
     *         description: Bad request
     */
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
