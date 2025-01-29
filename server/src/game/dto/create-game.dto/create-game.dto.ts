import { IsUUID, IsOptional } from 'class-validator';
import { HttpException, HttpStatus } from '@nestjs/common';

export class CreateGameDto {
  @IsUUID()
  player1Id: string;

  @IsUUID()
  @IsOptional()
  player2Id?: string;

  static validate(dto: CreateGameDto): void {
    try {
      if (!dto.player1Id) {
        throw new Error('player1Id is required');
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('Validation failed', HttpStatus.BAD_REQUEST);
    }
  }
}
