import { CurrentUser } from '@/common/decorators/currentUser.decorator';
import {
  User,
  UserEditDto,
  UserEditDtoSchema,
  UserEditPasswordDto,
  UserEditPasswordDtoSchema,
} from '@lostfound/shared';
import { Body, Controller, Get, Param, Patch, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  update(@Param('id') id: string, @Body() updateData: UserEditDto, @CurrentUser() user: User) {
    if (user.id !== +id) {
      throw new Error('无权限操作');
    }
    return this.usersService.update(+id, updateData);
  }

  @Patch()
  @UseGuards(AuthGuard('jwt'))
  updateUser(@Body() updateData: UserEditDto, @CurrentUser() user: User) {
    const result = UserEditDtoSchema.safeParse(updateData);
    if (!result.success) {
      throw new Error(result.error.issues.map((item) => item.message).join(', '));
    }
    return this.usersService.update(user.id, result.data);
  }

  @Patch('password')
  @UseGuards(AuthGuard('jwt'))
  updatePassword(@Body() body: UserEditPasswordDto, @CurrentUser() user: User) {
    const result = UserEditPasswordDtoSchema.safeParse(body);
    if (!result.success) {
      throw new Error(result.error.issues.map((item) => item.message).join(', '));
    }
    return this.usersService.updatePassword(
      user.id,
      result.data.oldPassword,
      result.data.newPassword
    );
  }
}
