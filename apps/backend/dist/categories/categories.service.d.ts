import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
export declare class CategoriesService {
    private categoriesRepository;
    constructor(categoriesRepository: Repository<Category>);
    findAll(): Promise<Category[]>;
    findOne(id: number): Promise<Category>;
    create(name: string): Promise<Category>;
    update(id: number, name: string): Promise<Category>;
    delete(id: number): Promise<void>;
}
