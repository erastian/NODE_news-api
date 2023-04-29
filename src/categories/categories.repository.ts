import { Category } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { DatabaseService } from '../database/prisma.service';

import { ICategoriesRepository } from './categories.repository.interface';
import { CategoryCreateDto } from './dto/category-create.dto';
import { CategoryUpdateDto } from './dto/category-update.dto';

@injectable()
export class CategoriesRepository implements ICategoriesRepository {
	constructor(@inject(TYPES.DatabaseService) private databaseService: DatabaseService) {}

	async findAllCategories(): Promise<Category[]> {
		return this.databaseService.client.category.findMany();
	}

	async findCategoryByURL(url: string): Promise<Category> {
		return this.databaseService.client.category.findUniqueOrThrow({
			where: { url },
			include: { articles: true },
		});
	}

	async createCategory(data: CategoryCreateDto): Promise<Category> {
		return this.databaseService.client.category.create({ data });
	}

	async updateCategory(id: number, data: CategoryUpdateDto): Promise<Category> {
		return this.databaseService.client.category.update({
			where: { id },
			data,
		});
	}
}
