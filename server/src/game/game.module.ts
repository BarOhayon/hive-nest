import { Module } from '@nestjs/common';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from './entities/game.entity';
import { PlayerService } from '@/player/player.service';
import { GameValidatorService } from './validators/game-validator';
import { Player } from '@/player/entities/player.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Game, Player])],
  controllers: [GameController],
  providers: [GameService, PlayerService, GameValidatorService],
})
export class GameModule {}
