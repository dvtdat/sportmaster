import { Event, User } from '../entities';
import { injectable } from 'inversify';
import {
  EntityManager,
  EntityRepository,
  MikroORM,
} from '@mikro-orm/postgresql';

import { CreateEventDto, EditEventDto } from './dto';

@injectable()
export class EventService {
  constructor(
    private readonly orm: MikroORM,
    private readonly em: EntityManager,
    private readonly eventRepository: EntityRepository<Event>
  ) {}

  public async createEvent(createEventDto: CreateEventDto) {
    const event = new Event(
      createEventDto.name,
      createEventDto.startedAt,
      createEventDto.endedAt,
      createEventDto.venue
    );
    await this.em.persistAndFlush(event);
    return event;
  }

  public async getEvents(filters: Partial<Event>): Promise<Event[]> {
    return this.eventRepository.find(filters, {
      orderBy: { id: 'asc' },
      populate: ['attendees', 'venue'],
    });
  }

  public async getEventById(id: number): Promise<Event> {
    return this.eventRepository.findOneOrFail(id, {
      populate: ['attendees', 'venue'],
    });
  }

  public async updateById(
    id: number,
    editEventDto: EditEventDto
  ): Promise<Event> {
    const event = await this.eventRepository.findOneOrFail(id, {
      populate: ['attendees', 'venue'],
    });

    event.name = editEventDto.name;
    event.description = editEventDto.description;
    event.startedAt = editEventDto.startedAt;
    event.endedAt = editEventDto.endedAt;
    event.venue = editEventDto.venue;

    await this.em.persistAndFlush(event);
    return event;
  }

  public async editAttendeesList(
    eventId: number,
    attendees: User[]
  ): Promise<Event> {
    const event = await this.eventRepository.findOneOrFail(eventId, {
      populate: ['attendees', 'venue'],
    });
    event.attendees.set(attendees);

    await this.em.persistAndFlush(event);
    return event;
  }

  public async deleteById(id: number): Promise<number> {
    return this.eventRepository.nativeDelete({ id });
  }
}
