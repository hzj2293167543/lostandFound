import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from '@lostfound/schema';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto): Promise<{
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
    login(dto: LoginDto): Promise<{
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
}
