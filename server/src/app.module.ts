import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameModule } from './game/game.module';
import { Game } from './game/entities/game.entity';
import { Player } from './player/entities/player.entity';
import { databaseConfig } from './config/database.config';
import { PlayerController } from './player/player.controller';
import { GameController } from './game/game.controller';
import { PlayerService } from './player/player.service';
import { GameService } from './game/game.service';
import { GameValidatorService } from './game/validators/game-validator';

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    TypeOrmModule.forFeature([Game, Player]),
    TerminusModule,
    GameModule,
  ],
  providers: [PlayerService, GameService, GameValidatorService],
  controllers: [PlayerController, GameController],
})
export class AppModule {}
