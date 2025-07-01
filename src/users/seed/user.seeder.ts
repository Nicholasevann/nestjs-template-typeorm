import { getRepository } from 'typeorm';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';

export async function seedUsers() {
  const userRepository = getRepository(User);
  const password = await bcrypt.hash('Password123', 10);
  const users = [
    {
      email: 'alice@example.com',
      password,
      firstName: 'Alice',
      lastName: 'Smith',
      avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
    },
    {
      email: 'bob@example.com',
      password,
      firstName: 'Bob',
      lastName: 'Johnson',
      avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
    },
    {
      email: 'carol@example.com',
      password,
      firstName: 'Carol',
      lastName: 'Williams',
      avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
    },
    {
      email: 'dave@example.com',
      password,
      firstName: 'Dave',
      lastName: 'Brown',
      avatar: 'https://randomuser.me/api/portraits/men/4.jpg',
    },
    {
      email: 'eve@example.com',
      password,
      firstName: 'Eve',
      lastName: 'Davis',
      avatar: 'https://randomuser.me/api/portraits/women/5.jpg',
    },
    {
      email: 'frank@example.com',
      password,
      firstName: 'Frank',
      lastName: 'Miller',
      avatar: 'https://randomuser.me/api/portraits/men/6.jpg',
    },
  ];
  for (const user of users) {
    await userRepository.save(user);
  }
  console.log('Seeded 6 users');
}
