import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthJwtConfig } from './config/auth-jwt.config';
import { AuthLocalStrategy } from './strategy/auth-local.strategy';
import { AuthJwtStrategy } from './strategy/auth-jwt.strategy';
import { EncryptModule } from './encrypt/encrypt.module';

import { CustomerEntity } from '@infrastructure/database/postgres/customers/customer.entity';
import { SupplierEntity } from '@infrastructure/database/postgres/suppliers/supplier.entity';

@Module({
  imports: [
    ConfigModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useClass: AuthJwtConfig,
    }),
    TypeOrmModule.forFeature([CustomerEntity, SupplierEntity]),
    EncryptModule,
  ],
  providers: [
    AuthService,
    AuthLocalStrategy,
    AuthJwtStrategy,
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule { }