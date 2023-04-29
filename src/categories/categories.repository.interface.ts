import { Category } from '@prisma/client';
import { CategoryCreateDto } from './dto/category-create.dto';
import { CategoryUpdateDto } from './dto/category-update.dto';

export interface ICategoriesRepository {
	findAllCategories: () => Promise<Category[]>;
	findCategoryByURL: (url: string) => Promise<Category>;
	createCategory: (data: CategoryCreateDto) => Promise<Category>;
	updateCategory: (id: number, data: CategoryUpdateDto) => Promise<Category>;
}
