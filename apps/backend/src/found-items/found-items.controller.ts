import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
  BadRequestException,
  Patch,
} from '@nestjs/common';
import { FoundItemsService } from './found-items.service';
import { AuthGuard } from '@nestjs/passport';
import { FoundItem as FoundItemVo, FoundCreateDto, User, FoundUpdateDto } from '@lostfound/shared';
import { CurrentUser } from 'src/common/decorators/currentUser.decorators';

@Controller('found-items')
export class FoundItemsController {
  constructor(private foundItemsService: FoundItemsService) {}

  @Get()
  findAll() {
    return this.foundItemsService.findAll();
  }

  @Get('top')
  findTop(
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number
  ): Promise<FoundItemVo[]> {
    if (limit === undefined) {
      limit = 10;
    }
    return this.foundItemsService.findTop(limit);
  }

  @Get('user/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.foundItemsService.findByUser(+userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.foundItemsService.findOne(+id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(@Body() data: FoundCreateDto, @CurrentUser() user: User) {
    return this.foundItemsService.create({
      ...data,
      userId: user.id,
    });
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  update(@Param('id') id: string, @Body() data: any, @CurrentUser() user: User) {
    if (user.id !== data.userId) {
      throw new BadRequestException('你只能更新自己的招领物品');
    }
    return this.foundItemsService.update(data);
  }

  @Patch()
  @UseGuards(AuthGuard('jwt'))
  async patch(@Body() data: FoundUpdateDto, @CurrentUser() user: User) {
    const foundItem = await this.foundItemsService.findOne(data.id);
    if (user.id !== foundItem.userId) {
      throw new BadRequestException('你只能更新自己的招领物品');
    }
    return this.foundItemsService.update(data);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  delete(@Param('id') id: string, @CurrentUser() user: User) {
    return this.foundItemsService.delete(+id);
  }
}
