import 'reflect-metadata';
import { createConnection } from 'typeorm';
import { User } from './src/users/entities/user.entity';
import { seedUsers } from './src/users/seed/user.seeder';

async function runSeeder() {
  try {
    const connection = await createConnection({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'nestjs-template',
      entities: [User],
      synchronize: true, // Ensure table exists for seeding
    });
    await seedUsers();
    await connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

runSeeder();
