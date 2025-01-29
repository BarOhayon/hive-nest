import { IsAlphanumeric, Length } from 'class-validator';
import { Player } from '@/player/entities/player.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

export enum GameStatus {
  WAITING = 'waiting',
  IN_PROGRESS = 'in_progress',
  FINISHED = 'finished',
}

@Entity()
export class Game {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Player)
  player1: Player;

  @ManyToOne(() => Player, { nullable: true })
  player2?: Player | null;

  @Column({
    type: 'enum',
    enum: GameStatus,
    default: GameStatus.WAITING,
  })
  status: GameStatus;

  @Column('json')
  board: object;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Length(4, 4)
  @IsAlphanumeric('en-US', {
    always: true,
    message: 'Code must be alphanumeric',
  })
  @Column({ type: 'char', length: 4, nullable: false, unique: true })
  code: string;
}
