import { Router } from 'express';
import { inject, injectable } from 'inversify';
import { VenueService } from '../services';
import { Request, Response } from 'express';

import { CreateVenueDto, EditVenueDto } from '../services/dto';

@injectable()
export class VenueController {
  public readonly router = Router();

  constructor(@inject('VenueService') private venueService: VenueService) {
    /**
     * @swagger
     * /venues:
     *   get:
     *     summary: Retrieve a list of venues
     *     tags: [Venues]
     *     responses:
     *       200:
     *         description: A list of venues
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Venue'
     *       400:
     *         description: Bad request
     */
    this.router.get('/', this.getAll.bind(this));

    /**
     * @swagger
     * /venues/{id}:
     *   get:
     *     summary: Retrieve a single venue by ID
     *     tags: [Venues]
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: integer
     *         required: true
     *         description: The venue ID
     *     responses:
     *       200:
     *         description: A single venue
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Venue'
     *       400:
     *         description: Bad request
     */
    this.router.get('/:id', this.getById.bind(this));

    /**
     * @swagger
     * /venues:
     *   post:
     *     summary: Create a new venue
     *     tags: [Venues]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/CreateVenueDto'
     *     responses:
     *       200:
     *         description: The created venue
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Venue'
     *       400:
     *         description: Bad request
     */
    this.router.post('/', this.create.bind(this));

    /**
     * @swagger
     * /venues/{id}:
     *   patch:
     *     summary: Update an existing venue
     *     tags: [Venues]
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: integer
     *         required: true
     *         description: The venue ID
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/EditVenueDto'
     *     responses:
     *       200:
     *         description: The updated venue
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Venue'
     *       400:
     *         description: Bad request
     */
    this.router.patch('/:id', this.update.bind(this));

    /**
     * @swagger
     * /venues/{id}:
     *   delete:
     *     summary: Delete a venue by ID
     *     tags: [Venues]
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: integer
     *         required: true
     *         description: The venue ID
     *     responses:
     *       200:
     *         description: Venue deleted successfully
     *       400:
     *         description: Bad request
     */
    this.router.delete('/:id', this.delete.bind(this));
  }

  async getAll(req: Request, res: Response) {
    try {
      const venues = await this.venueService.getVenues();
      res.json(venues);
    } catch (error) {
      res.status(400).json({ message: error });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const venue = await this.venueService.getVenueById(
        parseInt(req.params.id)
      );
      res.json(venue);
    } catch (error) {
      res.status(400).json({ message: error });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const name = req.body.name;
      const address = req.body.address;
      const phone = req.body.phone;

      const createVenueDto: CreateVenueDto = {
        name,
        address,
        phone,
      };

      const venue = await this.venueService.createVenue(createVenueDto);
      res.json(venue);
    } catch (error) {
      res.status(400).json({ message: error });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const venue = await this.venueService.getVenueById(
        parseInt(req.params.id)
      );

      const name = req.body.name || venue.name;
      const address = req.body.address || venue.address;
      const phone = req.body.phone;

      const editVenueDto: EditVenueDto = {
        name,
        address,
        phone,
      };

      const updatedVenue = await this.venueService.updateById(
        parseInt(req.params.id),
        editVenueDto
      );
      res.json(updatedVenue);
    } catch (error) {
      res.status(400).json({ message: error });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      await this.venueService.deleteById(parseInt(req.params.id));
      res.json({ message: 'Venue deleted successfully' });
    } catch (error) {
      res.status(400).json({ message: error });
    }
  }
}
