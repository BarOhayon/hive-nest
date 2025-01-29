import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT || '4001'),
  username: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'asdf',
  database: process.env.POSTGRES_DB || 'hive_game',
  entities: ['dist/**/*.entity{.ts,.js}'],
  synchronize: process.env.POSTGRES_SYNCHRONIZE === 'true',
};
