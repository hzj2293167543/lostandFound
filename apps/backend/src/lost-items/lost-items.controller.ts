import { LostCreateDto, LostItem as LostItemVo, LostUpdateDto, User } from '@lostfound/shared';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/common/decorators/currentUser.decorators';
import { LostItemsService } from './lost-items.service';

@Controller('lost-items')
export class LostItemsController {
  constructor(private lostItemsService: LostItemsService) {}

  @Get()
  findAll() {
    return this.lostItemsService.findAll();
  }

  @Get('top')
  findTop(
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number
  ): Promise<LostItemVo[]> {
    if (limit <= 0) {
      throw new BadRequestException('limit must be positive');
    }

    return this.lostItemsService.findTop(limit);
  }

  @Get('user/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.lostItemsService.findByUser(+userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lostItemsService.findOne(+id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(@Body() data: LostCreateDto, @CurrentUser() user: User) {
    return this.lostItemsService.create({
      ...data,
      userId: user.id,
    });
  }

  @Patch()
  @UseGuards(AuthGuard('jwt'))
  async updateById(@Body() data: LostUpdateDto, @CurrentUser() user: User) {
    const lostItem = await this.lostItemsService.findOne(data.id);
    if (user.id !== lostItem.user.id) {
      throw new BadRequestException('你只能更新自己的丢失物品');
    }
    return this.lostItemsService.updateById(data);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  delete(@Param('id') id: string, @CurrentUser() user: User) {
    return this.lostItemsService.delete(+id);
  }
}
