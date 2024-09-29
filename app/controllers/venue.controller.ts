import { Router } from 'express';
import { inject, injectable } from 'inversify';
import { VenueService } from '../services';
import { Request, Response } from 'express';

import { CreateVenueDto, EditVenueDto } from '../services/dto';

@injectable()
export class VenueController {
  public readonly router = Router();

  constructor(@inject('VenueService') private venueService: VenueService) {
    this.router.get('/', this.getAll.bind(this));
    this.router.get('/:id', this.getById.bind(this));
    this.router.post('/', this.create.bind(this));
    this.router.patch('/:id', this.update.bind(this));
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
