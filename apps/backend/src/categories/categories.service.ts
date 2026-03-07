import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>
  ) {}

  findAll(): Promise<Category[]> {
    return this.categoriesRepository.find();
  }

  async findOne(id: number): Promise<Category> {
    return this.categoriesRepository.findOne({ where: { id } });
  }

  async create(name: string): Promise<Category> {
    const category = this.categoriesRepository.create({ name });
    return this.categoriesRepository.save(category);
  }

  async update(id: number, name: string): Promise<Category> {
    await this.categoriesRepository.update(id, { name });
    return this.findOne(id);
  }

  async delete(id: number): Promise<void> {
    await this.categoriesRepository.delete(id);
  }
}
