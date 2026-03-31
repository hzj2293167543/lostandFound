import { CurrentUser } from '@/common/decorators/currentUser.decorator';
import { ZodValidationPipe } from '@/common/pipe';
import {
  AnnouncementCreateDto,
  AnnouncementEditDto,
  Announcement as AnnouncementVo,
  GetAnnouncementsParams,
  GetAnnouncementsParamsSchema,
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
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AnnouncementsService } from './announcements.service';

@Controller('announcements')
export class AnnouncementsController {
  constructor(private announcementsService: AnnouncementsService) {}

  @Get()
  findAllPaginated(
    @Query(new ZodValidationPipe(GetAnnouncementsParamsSchema)) params: GetAnnouncementsParams
  ) {
    const { page, limit, search } = params;
    const validPage = page ?? 1;
    const validLimit = limit ?? 12;
    return this.announcementsService.findAllPaginated({
      page: validPage,
      limit: validLimit,
      search,
    });
  }

  @Get('all')
  findAll() {
    return this.announcementsService.findAll();
  }

  @Get('top')
  findTop(
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 3
  ): Promise<AnnouncementVo[]> {
    if (limit <= 0) {
      throw new BadRequestException('limit must be positive');
    }
    return this.announcementsService.findTop(limit);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.announcementsService.findOne(+id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(@Body() data: AnnouncementCreateDto, @CurrentUser() user: User) {
    return this.announcementsService.create({
      ...data,
      authorId: user.id,
    });
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  update(@Param('id') id: string, @Body() data: AnnouncementEditDto, @CurrentUser() user: User) {
    const { author: _, ...rest } = data;
    return this.announcementsService.update(+id, {
      ...rest,
      authorId: user.id,
    });
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  delete(@Param('id') id: string) {
    return this.announcementsService.delete(+id);
  }
}
