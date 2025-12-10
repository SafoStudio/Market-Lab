import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomBytes } from 'crypto';
import { AuthTokenOrmEntity } from '@infrastructure/database/postgres/users/token.entity';

type typeKey = 'email_verification' | 'password_reset';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(AuthTokenOrmEntity)
    private readonly tokenRepo: Repository<AuthTokenOrmEntity>,
  ) { }

  async createToken(
    userId: string,
    type: typeKey,
    ttlHours: number = 24,
  ): Promise<string> {
    // removed old user token
    await this.tokenRepo.delete({ userId, type });

    // generate token
    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + ttlHours * 60 * 60 * 1000);

    const tokenEntity = this.tokenRepo.create({
      userId,
      type,
      token,
      expiresAt,
      used: false,
    });

    await this.tokenRepo.save(tokenEntity);
    return token;
  }

  async validateToken(
    token: string,
    type: typeKey,
  ): Promise<{ valid: boolean; userId?: string; error?: string }> {
    const tokenEntity = await this.tokenRepo.findOne({
      where: { token, type },
    });

    if (!tokenEntity) return { valid: false, error: 'Token not found' };
    if (tokenEntity.used) return { valid: false, error: 'Token already used' };
    if (new Date() > tokenEntity.expiresAt) return { valid: false, error: 'Token expired' };

    return { valid: true, userId: tokenEntity.userId };
  }

  async markTokenAsUsed(token: string): Promise<void> {
    await this.tokenRepo.update({ token }, { used: true });
  }

  async deleteUserTokens(userId: string, type?: typeKey): Promise<void> {
    const where: any = { userId };
    if (type) where.type = type;
    await this.tokenRepo.delete(where);
  }
}