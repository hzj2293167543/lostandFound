import { UsersService } from './users.service';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    findAll(): Promise<import("./entities/user.entity").User[]>;
    findOne(id: string): Promise<import("./entities/user.entity").User>;
    update(id: string, updateData: any, req: any): Promise<import("./entities/user.entity").User>;
    updatePassword(id: string, body: {
        oldPassword: string;
        newPassword: string;
    }, req: any): Promise<void>;
}
