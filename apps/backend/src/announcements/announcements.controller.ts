import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  Query,
  BadRequestException,
  ParseIntPipe,
} from '@nestjs/common';
import { AnnouncementsService } from './announcements.service';
import { AuthGuard } from '@nestjs/passport';
import { Announcement as AnnouncementVo } from '@lostfound/schema';

@Controller('announcements')
export class AnnouncementsController {
  constructor(private announcementsService: AnnouncementsService) {}

  @Get()
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
  create(@Body() data: any, @Request() req) {
    return this.announcementsService.create({
      ...data,
      authorId: req.user.id,
    });
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  update(@Param('id') id: string, @Body() data: any) {
    return this.announcementsService.update(+id, data);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  delete(@Param('id') id: string) {
    return this.announcementsService.delete(+id);
  }
}
