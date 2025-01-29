import { Game } from '@/game/entities/game.entity';
import { Player } from '@/player/entities/player.entity';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const databaseTestConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  username: 'postgres',
  password: 'asdf',
  database: 'hive_game_test',
  port: 8001,
  entities: [Game, Player],
  synchronize: true,
};
