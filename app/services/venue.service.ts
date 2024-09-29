import { Venue } from '../entities';
import { injectable } from 'inversify';
import {
  EntityManager,
  EntityRepository,
  MikroORM,
} from '@mikro-orm/postgresql';
import { CreateVenueDto, EditVenueDto } from './dto';

@injectable()
export class VenueService {
  constructor(
    private readonly orm: MikroORM,
    private readonly em: EntityManager,
    private readonly venueRepository: EntityRepository<Venue>
  ) {}

  public async createVenue(createVenueDto: CreateVenueDto) {
    const venue = new Venue();

    venue.name = createVenueDto.name;
    venue.address = createVenueDto.address;
    if (createVenueDto.phone) {
      venue.phone = createVenueDto.phone;
    }

    await this.em.persistAndFlush(venue);
    return venue;
  }

  public async getVenues(): Promise<Venue[]> {
    return this.venueRepository.findAll({
      orderBy: { id: 'asc' },
    });
  }

  public async getVenueById(id: number): Promise<Venue> {
    return this.venueRepository.findOneOrFail(id);
  }

  public async updateById(
    id: number,
    editVenueDto: EditVenueDto
  ): Promise<Venue> {
    const venue = await this.venueRepository.findOneOrFail(id);

    venue.name = editVenueDto.name;
    venue.address = editVenueDto.address;
    venue.phone = editVenueDto.phone;

    await this.em.persistAndFlush(venue);
    return venue;
  }

  public async deleteById(id: number): Promise<number> {
    return this.venueRepository.nativeDelete({ id });
  }
}
