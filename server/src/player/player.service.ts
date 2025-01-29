import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Player } from './entities/player.entity';
import { CreatePlayerDto } from './dto/create-player.dto/create-player.dto';

@Injectable()
export class PlayerService {
  constructor(
    @InjectRepository(Player)
    private playerRepository: Repository<Player>,
  ) {}

  async getById(id: string): Promise<Player> {
    const player = await this.playerRepository.findOneBy({ id });
    if (!player) throw new NotFoundException(`Player with ID ${id} not found`);
    return player;
  }

  async createPlayer(createPlaterDto: CreatePlayerDto): Promise<Player> {
    const player = this.playerRepository.create(createPlaterDto);
    return this.playerRepository.save(player);
  }
}
