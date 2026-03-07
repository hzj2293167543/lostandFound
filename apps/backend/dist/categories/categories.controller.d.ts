import { CategoriesService } from './categories.service';
export declare class CategoriesController {
    private categoriesService;
    constructor(categoriesService: CategoriesService);
    findAll(): Promise<import("./entities/category.entity").Category[]>;
    findOne(id: string): Promise<import("./entities/category.entity").Category>;
    create(name: string): Promise<import("./entities/category.entity").Category>;
    update(id: string, name: string): Promise<import("./entities/category.entity").Category>;
    delete(id: string): Promise<void>;
}
