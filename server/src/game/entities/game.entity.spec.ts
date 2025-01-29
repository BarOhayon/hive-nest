import { validate } from 'class-validator';
import { Game, GameStatus } from './game.entity';

describe('Game Entity', () => {
  function createValidGame(): Game {
    const game = new Game();
    game.id = '123e4567-e89b-12d3-a456-426614174000';
    game.status = GameStatus.WAITING;
    game.board = { pieces: [] };
    game.code = 'ABC1';
    game.createdAt = new Date();
    return game;
  }

  describe('Basic Properties', () => {
    it('should create a valid game instance', () => {
      const game = createValidGame();
      expect(game).toBeDefined();
      expect(game.status).toBe(GameStatus.WAITING);
      expect(game.board).toEqual({ pieces: [] });
    });

    it('should have correct default status when saving', () => {
      const game = new Game();
      game.status = GameStatus.WAITING;
      expect(game.status).toBe(GameStatus.WAITING);
    });
  });

  describe('Code Validation', () => {
    it('should reject a code shorter than 4 characters', async () => {
      const game = createValidGame();
      game.code = 'ABC';

      const errors = await validate(game);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isLength');
    });

    it('should reject a code longer than 4 characters', async () => {
      const game = createValidGame();
      game.code = 'ABC12';

      const errors = await validate(game);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isLength');
    });
  });
  describe('Game Status', () => {
    it('should accept valid game statuses', () => {
      const game = createValidGame();

      const validStatuses = [
        GameStatus.WAITING,
        GameStatus.IN_PROGRESS,
        GameStatus.FINISHED,
      ];

      validStatuses.forEach((status) => {
        game.status = status;
        expect(game.status).toBe(status);
      });
    });
  });

  describe('Board Structure', () => {
    it('should store board as JSON object', () => {
      const game = createValidGame();
      const testBoard = {
        pieces: [{ type: 'queen', position: { x: 0, y: 0 } }],
      };

      game.board = testBoard;
      expect(game.board).toEqual(testBoard);
    });
  });
});
