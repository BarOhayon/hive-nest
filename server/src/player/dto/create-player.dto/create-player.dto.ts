import { Entity } from 'typeorm';

@Entity()
export class CreatePlayerDto {
  name: string;
}
