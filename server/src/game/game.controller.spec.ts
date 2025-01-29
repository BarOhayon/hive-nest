import { Test, TestingModule } from '@nestjs/testing';
import { GameController } from './game.controller';
import { GameService } from './game.service';

describe('GameController', () => {
  let controller: GameController;
  let service: GameService;

  beforeEach(async () => {
    const mockGameService = {
      createGame: jest.fn(() => {}),
      findOne: jest.fn(() => {}),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [GameController],
      providers: [
        {
          provide: GameService,
          useValue: mockGameService,
        },
      ],
    }).compile();

    controller = module.get<GameController>(GameController);
    service = module.get<GameService>(GameService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a game', async () => {
    const createGameDto = {
      player1Id: 'some-uuid',
      player2Id: 'another-uuid',
    };

    const createGameSpy = jest.spyOn(service, 'createGame');
    await controller.create(createGameDto);

    expect(createGameSpy).toHaveBeenCalledWith(createGameDto);
  });
});
