import { BadRequestException } from '@nestjs/common';
import { IsOptional, IsUUID } from 'class-validator';

export class CreateGameDto {
  @IsUUID()
  player1Id: string;

  @IsUUID()
  @IsOptional()
  player2Id?: string;

  static validate(dto: CreateGameDto): void {
    if (!dto.player1Id) {
      throw new BadRequestException('player1Id is required');
    }
  }
}
