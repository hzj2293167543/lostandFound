import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @Get()
  findByItem(@Query('itemId') itemId: string, @Query('itemType') itemType: string) {
    return this.commentsService.findByItem(+itemId, +itemType);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(@Body() data: any, @Request() req) {
    return this.commentsService.create({
      ...data,
      userId: req.user.id,
    });
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  delete(@Param('id') id: string) {
    return this.commentsService.delete(+id);
  }
}
