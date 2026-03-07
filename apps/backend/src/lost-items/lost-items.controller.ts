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
  Request,
  ParseIntPipe,
  BadRequestException,
} from '@nestjs/common';
import { LostItemsService } from './lost-items.service';
import { AuthGuard } from '@nestjs/passport';
import { LostItem as LostItemVo } from '@lostfound/schema';

@Controller('lost-items')
export class LostItemsController {
  constructor(private lostItemsService: LostItemsService) {}

  @Get()
  findAll(@Query('categoryId') categoryId?: string) {
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
  create(@Body() data: any, @Request() req) {
    return this.lostItemsService.create({
      ...data,
      userId: req.user.id,
    });
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  update(@Param('id') id: string, @Body() data: any, @Request() req) {
    return this.lostItemsService.update(+id, data);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  delete(@Param('id') id: string, @Request() req) {
    return this.lostItemsService.delete(+id);
  }
}
