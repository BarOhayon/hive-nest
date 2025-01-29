import { PlayerService } from '@/player/player.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Game } from './entities/game.entity';
import { GameService } from './game.service';
import { GameValidatorService } from './validators/game-validator';
import { Test, TestingModule } from '@nestjs/testing';

describe('GameService', () => {
  let service: GameService;

  const mockGameRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
  };

  const mockPlayerService = {
    findOne: jest.fn(),
  };
  const mockGameValidatorService: jest.Mocked<Partial<GameValidatorService>> = {
    validateGameStart: jest.fn(),
    validateGameState: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GameService,
        {
          provide: getRepositoryToken(Game),
          useValue: mockGameRepository,
        },
        {
          provide: PlayerService,
          useValue: mockPlayerService,
        },
        {
          provide: GameValidatorService,
          useValue: mockGameValidatorService,
        },
      ],
    }).compile();

    service = module.get<GameService>(GameService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
