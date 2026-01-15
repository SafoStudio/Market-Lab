import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserOrmEntity } from '@infrastructure/database/postgres/users/user.entity';


@Injectable()
export class ProductOwnerService {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly usersRepository: Repository<UserOrmEntity>
  ) { }

  // Helper method to get supplierId from userId
  async getSupplierIdFromUserId(userId: string): Promise<string> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['supplierProfile']
    });

    if (!user) throw new NotFoundException(`User ${userId} not found`);
    if (!user.supplierProfile) throw new BadRequestException('User is not registered as a supplier');

    return user.supplierProfile.id;
  }

  async getSupplierCompanyName(userId: string): Promise<string> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['supplierProfile']
    });

    if (!user || !user.supplierProfile) throw new BadRequestException('User is not registered as a supplier');

    return user.supplierProfile.companyName;
  }

  async getSupplierInfo(userId: string): Promise<{
    supplierId: string;
    companyName: string
  }> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['supplierProfile']
    });

    if (!user) throw new NotFoundException(`User ${userId} not found`);
    if (!user.supplierProfile) throw new BadRequestException('User is not registered as a supplier');

    return {
      supplierId: user.supplierProfile.id,
      companyName: user.supplierProfile.companyName
    };
  }
}