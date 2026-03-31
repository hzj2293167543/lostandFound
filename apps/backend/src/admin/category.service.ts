import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { Category } from '../categories/entities/category.entity';
import { FoundItem } from '../found-items/entities/found-item.entity';
import { LostItem } from '../lost-items/entities/lost-item.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
    @InjectRepository(LostItem)
    private lostItemsRepository: Repository<LostItem>,
    @InjectRepository(FoundItem)
    private foundItemsRepository: Repository<FoundItem>
  ) {}

  getAllCategories(): Promise<Category[]> {
    return this.categoriesRepository.find();
  }

  createCategory(name: string): Promise<Category> {
    const category = this.categoriesRepository.create({ name });
    return this.categoriesRepository.save(category);
  }

  async updateCategory(id: number, name: string): Promise<Category> {
    await this.categoriesRepository.update(id, { name });
    return this.categoriesRepository.findOne({ where: { id } });
  }

  async deleteCategory(id: number): Promise<{ success: boolean; message: string }> {
    const categoryToDelete = await this.categoriesRepository.findOne({ where: { id } });
    if (!categoryToDelete) {
      return { success: false, message: '分类不存在' };
    }

    if (categoryToDelete.defaultSince !== null) {
      return { success: false, message: '系统默认分类不能被删除' };
    }

    const defaultCategory = await this.categoriesRepository.findOne({
      where: { defaultSince: Not(IsNull()) },
    });

    if (!defaultCategory) {
      return { success: false, message: '系统中没有默认分类，无法删除' };
    }

    const [lostCount, foundCount] = await Promise.all([
      this.lostItemsRepository.count({ where: { categoryId: id } }),
      this.foundItemsRepository.count({ where: { categoryId: id } }),
    ]);

    const totalItems = lostCount + foundCount;

    if (totalItems > 0) {
      await Promise.all([
        this.lostItemsRepository.update({ categoryId: id }, { categoryId: defaultCategory.id }),
        this.foundItemsRepository.update({ categoryId: id }, { categoryId: defaultCategory.id }),
      ]);
    }

    await this.categoriesRepository.delete(id);
    return {
      success: true,
      message:
        totalItems > 0
          ? `分类删除成功，已将 ${totalItems} 个物品迁移到分类「${defaultCategory.name}」`
          : '分类删除成功',
    };
  }
}
