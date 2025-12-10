import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthTokenOrmEntity } from '../../infrastructure/database/postgres/users/token.entity';
import { TokenService } from './token.service';

@Module({
  imports: [TypeOrmModule.forFeature([AuthTokenOrmEntity])],
  providers: [TokenService],
  exports: [TokenService],
})
export class TokensModule { }