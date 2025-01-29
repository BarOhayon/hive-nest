import { Controller, Post, Body, Param, HttpCode } from '@nestjs/common';
import { GameService } from './game.service';
import { CreateGameDto } from './dto/create-game.dto/create-game.dto';

@Controller('games')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post()
  create(@Body() createGameDto: CreateGameDto) {
    return this.gameService.createGame(createGameDto);
  }

  @HttpCode(200)
  @Post(':code/join')
  join(@Param('code') code: string, @Body() joinGameDto: { playerId: string }) {
    return this.gameService.joinGameByCode(code, joinGameDto.playerId);
  }
}
