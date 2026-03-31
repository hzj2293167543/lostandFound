import { CurrentUser } from '@/common/decorators/currentUser.decorator';
import { MuteGuard } from '@/common/guards/mute.guard';
import { ZodValidationPipe } from '@/common/pipe';
import {
  FoundCreateDto,
  FoundItem as FoundItemVo,
  FoundUpdateDto,
  GetFoundItemsParams,
  GetFoundItemsParamsSchema,
  User,
} from '@lostfound/shared';
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
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FoundItemsService } from './found-items.service';

@Controller('found-items')
export class FoundItemsController {
  constructor(private foundItemsService: FoundItemsService) {}

  @Get()
  findAllPaginated(
    @Query(new ZodValidationPipe(GetFoundItemsParamsSchema)) params: GetFoundItemsParams
  ) {
    const { page, limit, categoryId, status, search } = params;
    const validPage = page ?? 1;
    const validLimit = limit ?? 12;
    return this.foundItemsService.findAllPaginated({
      page: validPage,
      limit: validLimit,
      categoryId,
      status,
      search,
    });
  }

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
  findByUser(
    @Param('userId') userId: string,
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number
  ) {
    const validPage = (page ?? 1) > 0 ? page : 1;
    const validLimit = (limit ?? 10) > 0 ? limit : 10;
    return this.foundItemsService.findByUser(+userId, validPage, validLimit);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.foundItemsService.findOne(+id);
  }

  @Get('user/:userId/count')
  findUserCount(@Param('userId') userId: string) {
    return this.foundItemsService.findUserCount(Number(userId));
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), MuteGuard)
  create(@Body() data: FoundCreateDto, @CurrentUser() user: User) {
    return this.foundItemsService.create({
      ...data,
      userId: user.id,
    });
  }

  @Patch()
  @UseGuards(AuthGuard('jwt'))
  async patch(@Body() data: FoundUpdateDto, @CurrentUser() user: User) {
    const foundItem = await this.foundItemsService.findOne(data.id);
    if (user.id !== foundItem.user.id) {
      throw new BadRequestException('你只能更新自己的招领物品');
    }
    return this.foundItemsService.update(data);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async delete(@Param('id') id: string, @CurrentUser() user: User) {
    const foundItem = await this.foundItemsService.findOne(+id);
    if (user.id !== foundItem.user.id) {
      throw new BadRequestException('你只能删除自己的招领物品');
    }
    return this.foundItemsService.delete(+id);
  }
}
