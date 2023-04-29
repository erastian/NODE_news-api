import { Category } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { IConfigService } from '../config/config.service.interface';
import { TYPES } from '../types';

import { ICategoriesService } from './categories.service.interface';
import { ICategoriesRepository } from './categories.repository.interface';
import { CategoryCreateDto } from './dto/category-create.dto';
import { CategoryUpdateDto } from './dto/category-update.dto';

@injectable()
export class CategoriesService implements ICategoriesService {
	constructor(
		@inject(TYPES.IConfigService) private configService: IConfigService,
		@inject(TYPES.ICategoriesRepository) private categoriesRepository: ICategoriesRepository,
	) {}

	getAllCategories(): Promise<Category[]> {
		return this.categoriesRepository.findAllCategories();
	}

	getCategoryByURL(url: string): Promise<Category> {
		return this.categoriesRepository.findCategoryByURL(url);
	}

	createCategory(data: CategoryCreateDto): Promise<Category> {
		return this.categoriesRepository.createCategory(data);
	}

	updateCategory(id: number, data: CategoryUpdateDto): Promise<Category> {
		return this.categoriesRepository.updateCategory(id, data);
	}
}
