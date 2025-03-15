import { Router } from 'express';
import { inject, injectable } from 'inversify';
import { Event } from '../entities';
import { EventService, UserService, VenueService } from '../services';
import { Request, Response } from 'express';

import { CreateEventDto, EditEventDto } from '../services/dto';

@injectable()
export class EventController {
  public readonly router = Router();

  constructor(
    @inject('EventService') private eventService: EventService,
    @inject('UserService') private userService: UserService,
    @inject('VenueService') private venueService: VenueService
  ) {
    /**
     * @swagger
     * /events:
     *   get:
     *     summary: Retrieve a list of events
     *     tags: [Events]
     *     parameters:
     *       - in: query
     *         name: venueId
     *         schema:
     *           type: integer
     *         description: Filter events by venue ID
     *     responses:
     *       200:
     *         description: A list of events
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Event'
     */
    this.router.get('/', this.getAll.bind(this));

    /**
     * @swagger
     * /events/{id}:
     *   get:
     *     summary: Retrieve an event by ID
     *     tags: [Events]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *     responses:
     *       200:
     *         description: An event
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Event'
     */
    this.router.get('/:id', this.getById.bind(this));

    /**
     * @swagger
     * /events:
     *   post:
     *     summary: Create a new event
     *     tags: [Events]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               name:
     *                 type: string
     *               description:
     *                 type: string
     *               startedAt:
     *                 type: string
     *                 format: date-time
     *               endedAt:
     *                 type: string
     *                 format: date-time
     *               venueId:
     *                 type: integer
     *                 example: 1
     *     responses:
     *       200:
     *         description: The created event
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Event'
     *       400:
     *         description: Bad request
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     */
    this.router.post('/', this.create.bind(this));

    /**
     * @swagger
     * /events/{id}:
     *   patch:
     *     summary: Update an event by ID
     *     tags: [Events]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               name:
     *                 type: string
     *               description:
     *                 type: string
     *               startedAt:
     *                 type: string
     *                 format: date-time
     *               endedAt:
     *                 type: string
     *                 format: date-time
     *               venueId:
     *                 type: integer
     *                 example: 1
     *     responses:
     *       200:
     *         description: The updated event
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Event'
     */
    this.router.patch('/:id', this.update.bind(this));

    /**
     * @swagger
     * /events/{id}:
     *   delete:
     *     summary: Delete an event by ID
     *     tags: [Events]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *     responses:
     *       200:
     *         description: The deleted event
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *       400:
     *         description: Bad request
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     */
    this.router.delete('/:id', this.delete.bind(this));

    /**
     * @swagger
     * /events/{id}/attendees:
     *   post:
     *     summary: Edit attendees of an event
     *     tags: [Events]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               userIds:
     *                 type: array
     *                 items:
     *                   type: integer
     *     responses:
     *       200:
     *         description: The updated event with attendees
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Event'
     */
    this.router.post('/:id/attendees', this.editAttendees.bind(this));
  }

  async getAll(req: Request, res: Response) {
    try {
      const filters: Partial<Event> = {};

      const venueId = req.query.venueId as string;

      if (venueId) {
        const venue = await this.venueService.getVenueById(parseInt(venueId));
        filters.venue = venue;
      }

      const events = await this.eventService.getEvents(filters);
      res.json(events);
    } catch (error) {
      res.status(400).json({ message: error });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const event = await this.eventService.getEventById(
        parseInt(req.params.id)
      );
      res.json(event);
    } catch (error) {
      res.status(400).json({ message: error });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const name = req.body.name;
      const description = req.body.description;
      const startedAt = req.body.startedAt;
      const endedAt = req.body.endedAt;
      const venueId = req.body.venueId;

      const venue = await this.venueService.getVenueById(venueId);

      if (!venue) {
        throw new Error('Venue not found');
      }

      if (startedAt > endedAt) {
        throw new Error('Event cannot end before it starts');
      }

      if (new Date(startedAt) < new Date()) {
        throw new Error('Event cannot start in the past');
      }

      const createEventDto: CreateEventDto = {
        name,
        description,
        startedAt,
        endedAt,
        venue,
      };

      const event = await this.eventService.createEvent(createEventDto);
      res.json(event);
    } catch (error) {
      res.status(400).json({ message: error });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const event = await this.eventService.getEventById(
        parseInt(req.params.id)
      );

      const name = req.body.name || event.name;
      const description = req.body.description || event.description;
      const startedAt = req.body.startedAt || event.startedAt;
      const endedAt = req.body.endedAt || event.endedAt;
      const venueId = req.body.venueId || event.venue.id;

      const venue = await this.venueService.getVenueById(venueId);

      if (!venue) {
        throw new Error('Venue not found');
      }

      if (startedAt > endedAt) {
        throw new Error('Event cannot end before it starts');
      }

      if (new Date(startedAt) < new Date()) {
        throw new Error('Event cannot start in the past');
      }

      const editEventDto: EditEventDto = {
        name,
        description,
        startedAt,
        endedAt,
        venue,
      };

      const updatedEvent = await this.eventService.updateById(
        parseInt(req.params.id),
        editEventDto
      );
      res.json(updatedEvent);
    } catch (error) {
      res.status(400).json({ message: error });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      await this.eventService.getEventById(parseInt(req.params.id));

      await this.eventService.deleteById(parseInt(req.params.id));
      res.json({ message: 'Event deleted successfully' });
    } catch (error) {
      res.status(400).json({ message: error });
    }
  }

  async editAttendees(req: Request, res: Response) {
    try {
      const eventId = parseInt(req.params.id);
      const userIds = req.body.userIds;

      const users = await Promise.all(
        userIds.map(async (userId: number) => {
          const user = await this.userService.getUserById(userId);
          return user;
        })
      );

      const event = await this.eventService.editAttendeesList(eventId, users);

      res.json(event);
    } catch (error) {
      res.status(400).json({ message: error });
    }
  }
}
