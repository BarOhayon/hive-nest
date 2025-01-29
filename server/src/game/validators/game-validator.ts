import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Game, GameStatus } from '../entities/game.entity';

@Injectable()
export class GameValidatorService {
  validateGameState(game: Game): void {
    if (!game) {
      throw new NotFoundException('Game not found');
    }
    if (game.status === GameStatus.FINISHED) {
      throw new BadRequestException('Game is already finished');
    }
  }

  validateGameStart(game: Game): boolean {
    this.validateGameState(game);

    if (!game.player1 || !game.player2) {
      throw new BadRequestException(
        'Both players must be present to start game',
      );
    }

    if (game.status !== GameStatus.WAITING) {
      throw new BadRequestException('Game must be in WAITING status to start');
    }
    return true;
  }
}
