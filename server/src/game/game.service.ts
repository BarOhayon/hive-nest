import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Game, GameStatus } from './entities/game.entity';
import { CreateGameDto } from './dto/create-game.dto/create-game.dto';
import { PlayerService } from '@/player/player.service';
import { generateRandomCode } from '@/utils/code-generator';
import { GameValidatorService } from './validators/game-validator';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(Game)
    private gameRepository: Repository<Game>,
    private playerService: PlayerService,
    private gameValidator: GameValidatorService,
  ) {}

  async createGame(createGameDto: CreateGameDto): Promise<Game> {
    const player = await this.playerService.getById(createGameDto.player1Id);
    if (!player)
      throw new NotFoundException(
        `Player ${createGameDto.player1Id} not found`,
      );
    const game = this.gameRepository.create({
      player1: { id: player.id, name: player.name },
      status: GameStatus.WAITING,
      board: {
        pieces: [],
        currentPlayer: createGameDto.player1Id,
      },
      code: generateRandomCode(),
    });

    if (createGameDto.player2Id) {
      await this.joinGameByCode(game.code, createGameDto.player2Id);
    }
    return await this.gameRepository.save(game);
  }

  async joinGameByCode(code: string, playerId: string): Promise<Game> {
    const game = await this.gameRepository.findOne({
      where: { code },
      relations: ['player1', 'player2'],
      select: {
        id: true,
        status: true,
        player1: { id: true },
        player2: { id: true },
      },
    });

    if (!game) throw new NotFoundException(`Game with code ${code} not found`);
    const player = await this.playerService.getById(playerId);
    if (!player)
      throw new NotFoundException(`Player with ID ${playerId} not found`);
    if (game.player1?.id === playerId || game.player2?.id === playerId)
      throw new BadRequestException(
        `Player "${player.name}" is already in the game`,
      );
    game.player2 = player;
    if (game.status === GameStatus.WAITING && game.player1 && game.player2) {
      return this.startGame(game);
    }
    return this.gameRepository.save(game);
  }

  async startGame(game: Game): Promise<Game> {
    this.gameValidator.validateGameStart(game);
    game.status = GameStatus.IN_PROGRESS;
    return this.gameRepository.save(game);
  }
}
