import {
  GetLostItemsParams,
  GetLostItemsParamsSchema,
  LostCreateDto,
  LostCreateDtoSchema,
  LostItem as LostItemVo,
  LostUpdateDto,
  LostUpdateDtoSchema,
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
import { CurrentUser } from '@/common/decorators/currentUser.decorator';
import { LostItemsService } from './lost-items.service';
import { ZodValidationPipe } from '@/common/pipe';
import { MuteGuard } from '@/common/guards/mute.guard';

@Controller('lost-items')
export class LostItemsController {
  constructor(private lostItemsService: LostItemsService) {}

  @Get()
  findAllPaginated(
    @Query(new ZodValidationPipe(GetLostItemsParamsSchema)) params: GetLostItemsParams
  ) {
    const { page, limit, categoryId, status, search } = params;
    const validPage = page ?? 1;
    const validLimit = limit ?? 12;
    return this.lostItemsService.findAllPaginated({
      page: validPage,
      limit: validLimit,
      categoryId,
      status,
      search,
    });
  }

  @Get('all')
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
  findByUser(
    @Param('userId') userId: string,
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number
  ) {
    const validPage = (page ?? 1) > 0 ? page : 1;
    const validLimit = (limit ?? 10) > 0 ? limit : 10;
    return this.lostItemsService.findByUser(+userId, validPage, validLimit);
  }
  @Get('user/:userId/count')
  findUserCount(@Param('userId') userId: string) {
    return this.lostItemsService.findUserCount(Number(userId));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lostItemsService.findOne(+id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), MuteGuard)
  create(
    @Body(new ZodValidationPipe(LostCreateDtoSchema)) data: LostCreateDto,
    @CurrentUser() user: User
  ) {
    return this.lostItemsService.create({
      ...data,
      userId: user.id,
    });
  }

  @Patch()
  @UseGuards(AuthGuard('jwt'))
  async updateById(
    @Body(new ZodValidationPipe(LostUpdateDtoSchema)) data: LostUpdateDto,
    @CurrentUser() user: User
  ) {
    if (!data) {
      throw new BadRequestException('Invalid update data');
    }
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
