import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';

@Injectable()
export class UserManagementService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>
  ) {}

  getAllUsers(): Promise<User[]> {
    return this.usersRepository.find({ where: { role: 0 }, withDeleted: true });
  }

  async getUsersPaginated(page: number, pageSize: number) {
    const [items, total] = await this.usersRepository.findAndCount({
      where: { role: 0 },
      withDeleted: true,
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: { createdAt: 'DESC' },
    });
    return {
      items,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async updateUserStatus(userId: number, status: number): Promise<User> {
    await this.usersRepository.update(userId, { status });
    return this.usersRepository.findOne({ where: { id: userId } });
  }

  async softDeleteUser(id: number): Promise<void> {
    await this.usersRepository.softDelete(id);
  }

  async restoreUser(id: number): Promise<void> {
    await this.usersRepository.restore(id);
  }
}
