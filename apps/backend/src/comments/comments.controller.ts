import { CurrentUser } from '@/common/decorators/currentUser.decorators';
import { CommentCreateDto, commentCreateDtoSchema, CommentItem, User } from '@lostfound/shared';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CommentsService } from './comments.service';

@Controller('comments')
@UseGuards(AuthGuard('jwt'))
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @Get()
  findByItem(
    @Query('itemId', new ParseIntPipe()) itemId: number,
    @Query('itemType', new ParseIntPipe()) itemType: number,
    @CurrentUser() user: User
  ): Promise<CommentItem[]> {
    return this.commentsService.findByItem(itemId, itemType, user.id);
  }

  @Get(':id/likes')
  like(@Param('id', new ParseIntPipe()) id: number) {
    return this.commentsService.findLikes(id);
  }

  @Get(':id/liked')
  isLiked(@Param('id', new ParseIntPipe()) id: number, @CurrentUser() user: User) {
    return this.commentsService.findLiked(id, user.id);
  }

  @Get('user/:userId')
  findByUser(
    @Param('userId', new ParseIntPipe()) userId: number,
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number
  ) {
    const validPage = (page ?? 1) > 0 ? page : 1;
    const validLimit = (limit ?? 10) > 0 ? limit : 10;
    return this.commentsService.findByUser(userId, validPage, validLimit);
  }

  @Post()
  create(@Body() data: CommentCreateDto, @CurrentUser() user: User) {
    console.log(data);
    const result = commentCreateDtoSchema.safeParse(data);
    if (!result.success) {
      throw new BadRequestException(result.error);
    }
    return this.commentsService.create({
      ...data,
      userId: user.id,
    });
  }

  @Post(':id/like')
  likeComment(
    @Param('id', new ParseIntPipe()) id: number,
    @CurrentUser() user: User,
    @Query('isLiked', new ParseBoolPipe()) isLike: boolean
  ) {
    return this.commentsService.likeComment(id, user.id, isLike);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  delete(@Param('id') id: string) {
    return this.commentsService.delete(+id);
  }
}
