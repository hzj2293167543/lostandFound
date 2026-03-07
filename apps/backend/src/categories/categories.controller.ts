import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { CategoriesService } from './categories.service';

@Controller('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(+id);
  }

  @Post()
  create(@Body('name') name: string) {
    return this.categoriesService.create(name);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body('name') name: string) {
    return this.categoriesService.update(+id, name);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.categoriesService.delete(+id);
  }
}
