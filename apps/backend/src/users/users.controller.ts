import { Controller, Get, Put, Param, Body, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';

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
  update(@Param('id') id: string, @Body() updateData: any, @Request() req) {
    if (req.user.id !== +id) {
      throw new Error('无权限操作');
    }
    return this.usersService.update(+id, updateData);
  }

  @Put(':id/password')
  @UseGuards(AuthGuard('jwt'))
  updatePassword(
    @Param('id') id: string,
    @Body() body: { oldPassword: string; newPassword: string },
    @Request() req
  ) {
    if (req.user.id !== +id) {
      throw new Error('无权限操作');
    }
    return this.usersService.updatePassword(+id, body.oldPassword, body.newPassword);
  }
}
