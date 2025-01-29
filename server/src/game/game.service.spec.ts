/* eslint-disable @typescript-eslint/unbound-method */
import { PlayerService } from '@/player/player.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateGameDto } from './dto/create-game.dto/create-game.dto';
import { Game, GameStatus } from './entities/game.entity';
import { GameService } from './game.service';
import { GameValidatorService } from './validators/game-validator';

describe('GameService', () => {
  let service: GameService;
  let gameRepository: Repository<Game>;
  let playerService: PlayerService;
  let gameValidator: GameValidatorService;

  const mockPlayer = { id: 'player1', name: 'Player One' };
  const mockPlayer2 = { id: 'player2', name: 'Player Two' };

  const mockGame = {
    id: 'game1',
    player1: mockPlayer,
    status: GameStatus.WAITING,
    code: '1234',
    board: { pieces: [], currentPlayer: 'player1' },
    createdAt: new Date(),
  };

  const mockCreateGameDto: CreateGameDto = {
    player1Id: 'player1',
    player2Id: 'player2',
  };

  const mockGameValidatorService = {
    validateGameStart: jest.fn(),
  };

  const mockPlayerService = {
    getById: jest.fn().mockResolvedValue(mockPlayer),
  };

  const mockGameRepository = {
    create: jest.fn().mockReturnValue(mockGame),
    save: jest.fn().mockResolvedValue(mockGame),
    findOne: jest.fn().mockResolvedValue(mockGame), // Mock game is found
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
    gameRepository = module.get<Repository<Game>>(getRepositoryToken(Game));
    playerService = module.get<PlayerService>(PlayerService);
    gameValidator = module.get<GameValidatorService>(GameValidatorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createGame', () => {
    it('should throw NotFoundException if player1 is not found', async () => {
      playerService.getById = jest.fn().mockResolvedValue(null);
      await expect(service.createGame(mockCreateGameDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should create a game and return it', async () => {
      playerService.getById = jest.fn().mockResolvedValue(mockPlayer);
      gameRepository.save = jest.fn().mockResolvedValue(mockGame);

      const result = await service.createGame(mockCreateGameDto);
      expect(result).toEqual(mockGame);
      expect(gameRepository.save).toHaveBeenCalledWith(mockGame);
    });

    it('should join a player to an existing game by code', async () => {
      gameRepository.findOne = jest.fn().mockResolvedValue(mockGame);

      const result = await service.joinGameByCode('1234', mockPlayer2.id);
      expect(result).toEqual(mockGame);
      expect(gameRepository.save).toHaveBeenCalledWith(mockGame);
    });

    it('should throw NotFoundException if game is not found', async () => {
      gameRepository.findOne = jest.fn().mockResolvedValue(null);
      await expect(
        service.joinGameByCode('1234', mockPlayer2.id),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if player2 is not found', async () => {
      playerService.getById = jest.fn().mockResolvedValue(null);
      await expect(
        service.joinGameByCode('1234', mockPlayer2.id),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if player is already in the game', async () => {
      const gameWithPlayer = {
        ...mockGame,
        player1: mockPlayer,
        player2: null,
      };

      gameRepository.findOne = jest.fn().mockResolvedValue(gameWithPlayer);
      playerService.getById = jest.fn().mockResolvedValue(mockPlayer);

      await expect(
        service.joinGameByCode('1234', mockPlayer.id),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('startGame', () => {
    it('should start the game and return it', async () => {
      mockGame.status = GameStatus.WAITING;
      gameValidator.validateGameStart = jest.fn();

      const result = await service.startGame(mockGame);
      expect(result.status).toBe(GameStatus.IN_PROGRESS);
      expect(gameRepository.save).toHaveBeenCalledWith(mockGame);
      expect(gameValidator.validateGameStart).toHaveBeenCalledWith(mockGame);
    });
  });
});
