import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { AppModule } from '../../app.module';
import { SuperAdminInitService } from './super-admin.init';
import { seedCategories } from './seed-categories';

const logger = new Logger('SeedRunner');

async function runAllSeeds() {
  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    logger.log('🚀 Starting database seeding...');

    // 1. Get database connection
    const dataSource = app.get(DataSource);

    // 2. Seed categories first (they're independent)
    logger.log('🌱 Seeding categories...');
    await seedCategories(dataSource);
    logger.log('✅ Categories seeded successfully');

    // 3. Initialize super admin (depends on auth services)
    logger.log('👑 Initializing super admin...');
    const superAdminService = app.get(SuperAdminInitService);
    await superAdminService.initializeSuperAdmin();
    logger.log('✅ Super admin initialized successfully');

    // 4. Seed test products
    // await seedProducts(dataSource);

    logger.log('🎉 All seeds completed successfully!');

  } catch (error) {
    logger.error('💥 Seeding failed:', error);
    process.exit(1);
  } finally {
    await app.close();
  }
}

// Run if called directly
if (require.main === module) {
  runAllSeeds();
}

export { runAllSeeds };