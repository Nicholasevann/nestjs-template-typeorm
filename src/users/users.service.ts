import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Like, Repository } from 'typeorm';
import { PaginationDto } from 'src/common/pagination/pagination.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    // Hash the password before saving
    const userExist = await this.findOneByEmail(createUserDto.email);
    if (userExist) throw new BadRequestException('Email already used');
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
    const savedUser = await this.userRepository.save(user);

    return {
      message: 'User created successfully',
      data: savedUser,
    };
  }

  async findAll(paginationDto: PaginationDto) {
    const {
      page = 1,
      limit = 10,
      sortBy = 'id',
      sortOrder = 'desc',
      search,
    } = paginationDto;

    const where = search
      ? [
          { email: Like(`%${search}%`) },
          { firstName: Like(`%${search}%`) },
          { lastName: Like(`%${search}%`) },
        ]
      : undefined;

    const [users, total] = await this.userRepository.findAndCount({
      where,
      order: { [sortBy]: sortOrder.toUpperCase() as 'ASC' | 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      message: 'Users retrieved successfully',
      data: users,
      meta: {
        total,
        page,
        limit,
        totalPage: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    return {
      message: user ? 'User found' : 'User not found',
      data: user,
    };
  }
  async findOneByEmail(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.userRepository.update(id, updateUserDto);
    return {
      message: 'User updated successfully',
      data: null,
    };
  }

  async remove(id: string) {
    await this.userRepository.delete(id);
    return {
      message: 'User deleted successfully',
      data: null,
    };
  }
}
