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
} from '@nestjs/common';
import { FoundItemsService } from './found-items.service';
import { AuthGuard } from '@nestjs/passport';
import { FoundItem as FoundItemVo } from '@lostfound/schema';

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
  create(@Body() data: any, @Request() req) {
    return this.foundItemsService.create({
      ...data,
      userId: req.user.id,
    });
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  update(@Param('id') id: string, @Body() data: any, @Request() req) {
    return this.foundItemsService.update(+id, data);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  delete(@Param('id') id: string, @Request() req) {
    return this.foundItemsService.delete(+id);
  }
}
