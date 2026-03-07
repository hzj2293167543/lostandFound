import { ConfigService } from '@nestjs/config';
import { Strategy } from 'passport-jwt';
import { AuthService } from './auth.service';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private authService;
    private configService;
    constructor(authService: AuthService, configService: ConfigService);
    validate(payload: {
        sub: number;
        email: string;
    }): Promise<import("../users/entities/user.entity").User>;
}
export {};
