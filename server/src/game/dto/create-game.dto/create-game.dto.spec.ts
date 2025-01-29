import { validate } from 'class-validator';
import { CreateGameDto } from './create-game.dto';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('CreateGameDto', () => {
  describe('class-validator decorators', () => {
    it('should pass validation with valid player1Id', async () => {
      const dto = new CreateGameDto();
      dto.player1Id = '123e4567-e89b-12d3-a456-426614174000';

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should fail validation with invalid player1Id UUID format', async () => {
      const dto = new CreateGameDto();
      dto.player1Id = 'not-a-uuid';

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isUuid');
    });

    it('should pass validation with optional player2Id', async () => {
      const dto = new CreateGameDto();
      dto.player1Id = '123e4567-e89b-12d3-a456-426614174000';
      dto.player2Id = '987fcdeb-51d3-12a4-b456-426614174000';

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });
  });

  describe('static validate method', () => {
    it('should not throw when player1Id is present', () => {
      const dto = new CreateGameDto();
      dto.player1Id = '123e4567-e89b-12d3-a456-426614174000';

      expect(() => CreateGameDto.validate(dto)).not.toThrow();
    });

    it('should throw HttpException when player1Id is missing', () => {
      const dto = new CreateGameDto();

      expect(() => CreateGameDto.validate(dto)).toThrow(HttpException);
      try {
        CreateGameDto.validate(dto);
      } catch (error: unknown) {
        expect(error instanceof HttpException).toBe(true);
        if (error instanceof HttpException) {
          expect(error.getStatus()).toBe(HttpStatus.BAD_REQUEST);
        }
        if (error instanceof HttpException) {
          expect(error.message).toBe('player1Id is required');
        }
      }
    });
  });
});
