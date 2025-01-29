import { databaseTestConfig } from '@/config/database-test.config';
import { GameModule } from '@/game/game.module';
import { PlayerModule } from '@/player/player.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as request from 'supertest';
import { DataSource } from 'typeorm';
import { Game } from '../src/game/entities/game.entity';
import { Player } from '../src/player/entities/player.entity';
interface PlayerResponse {
  id: string;
  name: string;
}

interface GameResponse {
  id: string;
  code: string;
  status: 'waiting' | 'in_progress' | 'finished';
  board: object;
  player1?: PlayerResponse;
  player2?: PlayerResponse;
  createdAt: string;
}

type RequestMethod = 'get' | 'post' | 'put' | 'delete';

async function makeRequest<T>(
  app: INestApplication,
  method: RequestMethod,
  url: string,
  data?: object,
  expectedStatus = 200,
): Promise<T> {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const server = app.getHttpServer();
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const req = request(server)[method](url);

  if (data) {
    req.send(data);
  }

  const response = await req.expect(expectedStatus);
  return response.body as T;
}

describe('Game Flow (e2e)', () => {
  let app: INestApplication;
  let createdPlayer1Id: string;
  let createdPlayer2Id: string;
  let gameCode: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: '.env.test',
          load: [() => databaseTestConfig],
          isGlobal: true,
        }),
        TypeOrmModule.forRoot(databaseTestConfig),
        TypeOrmModule.forFeature([Game, Player]),
        GameModule,
        PlayerModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    const connection = app.get(DataSource);
    await connection.dropDatabase();
    await connection.synchronize();

    await app.init();
  });

  describe('Game Creation and Join Flow', () => {
    it('should create two players', async () => {
      const player1Response = await makeRequest<PlayerResponse>(
        app,
        'post',
        '/player',
        { name: 'Player 1' },
        201,
      );

      createdPlayer1Id = player1Response.id;
      expect(player1Response.name).toBe('Player 1');

      const player2Response = await makeRequest<PlayerResponse>(
        app,
        'post',
        '/player',
        { name: 'Player 2' },
        201,
      );

      createdPlayer2Id = player2Response.id;
      expect(player2Response.name).toBe('Player 2');
    });

    it('should create a new game', async () => {
      const gameResponse = await makeRequest<GameResponse>(
        app,
        'post',
        '/games',
        { player1Id: createdPlayer1Id },
        201,
      );

      gameCode = gameResponse.code;
      expect(gameResponse.status).toBe('waiting');
      expect(gameResponse.player1?.id).toBe(createdPlayer1Id);
      expect(gameResponse.code).toMatch(/^[A-Za-z0-9]{4}$/);
      expect(gameResponse.board).toBeDefined();
    });

    it('should allow second player to join the game', async () => {
      const gameResponse = await makeRequest<GameResponse>(
        app,
        'post',
        `/games/${gameCode}/join`,
        { playerId: createdPlayer2Id },
        200,
      );

      expect(gameResponse.status).toBe('in_progress');
      expect(gameResponse.player2?.id).toBe(createdPlayer2Id);
    });

    it('should not allow the same player to join twice', async () => {
      await makeRequest(
        app,
        'post',
        `/games/${gameCode}/join`,
        { playerId: createdPlayer2Id },
        400,
      );
    });

    it('should not allow joining with invalid game code', async () => {
      await makeRequest(
        app,
        'post',
        '/games/INVALID/join',
        { playerId: createdPlayer2Id },
        404,
      );
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
