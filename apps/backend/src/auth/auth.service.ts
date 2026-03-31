import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { LoginDto } from '@lostfound/shared';
import { userToLoginBackDto } from './auth.mapper';
import { Punishment } from '@/reports/entities/punishment.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Punishment)
    private punishmentRepository: Repository<Punishment>,
    private jwtService: JwtService
  ) {}

  async register(name: string, email: string, password: string) {
    const existingUser = await this.usersRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('邮箱已被注册');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.usersRepository.create({
      name,
      email,
      password: hashedPassword,
      avatar:
        'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=default%20user%20avatar&image_size=square',
      description: '',
    });

    await this.usersRepository.save(user);
    return this.generateToken(user);
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersRepository.findOne({
      where: { email: loginDto.email },
      withDeleted: true,
    });

    const isBanned = await this.punishmentRepository.findOne({
      where: {
        userId: user.id,
      },
    });
    if (isBanned) {
      throw new UnauthorizedException('账号已被封禁，请联系管理员');
    }

    if (user.status === 0 || user.deletedAt) {
      throw new UnauthorizedException('账号已被禁用');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('邮箱或密码错误');
    }

    await this.usersRepository.update(user.id, { lastLoginAt: new Date() });
    return this.generateToken(user);
  }

  validateUser(userId: number): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id: userId } });
  }

  private generateToken(user: User) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    const token = this.jwtService.sign(payload);
    return userToLoginBackDto(user, token);
  }
}
