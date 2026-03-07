import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import { LoginDto } from '@lostfound/schema';
export declare class AuthService {
    private usersRepository;
    private jwtService;
    constructor(usersRepository: Repository<User>, jwtService: JwtService);
    register(name: string, email: string, password: string): Promise<{
        token: string;
        user: {
            email: string;
            status: number;
            id: number;
            name: string;
            contact: string;
            description: string;
            avatar: string;
            role: number;
        };
    }>;
    login(loginDto: LoginDto): Promise<{
        token: string;
        user: {
            email: string;
            status: number;
            id: number;
            name: string;
            contact: string;
            description: string;
            avatar: string;
            role: number;
        };
    }>;
    validateUser(userId: number): Promise<User | null>;
    private generateToken;
}
