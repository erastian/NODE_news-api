import { Article } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { DatabaseService } from '../database/prisma.service';

import { IArticlesRepository } from './articles.repository.interface';
import { ArticleCreateDto } from './dto/article-create.dto';
import { ArticleUpdateDto } from './dto/article-update.dto';

@injectable()
export class ArticlesRepository implements IArticlesRepository {
	constructor(@inject(TYPES.DatabaseService) private databaseService: DatabaseService) {}

	async findAllArticles(): Promise<Article[]> {
		return this.databaseService.client.article.findMany();
	}

	async findArticleByID(id: number): Promise<Article> {
		return this.databaseService.client.article.findUniqueOrThrow({
			where: { id },
		});
	}

	async createArticle(data: ArticleCreateDto, authorID: number): Promise<Article> {
		return this.databaseService.client.article.create({
			data: { ...data, authorID },
		});
	}

	async updateArticle(id: number, data: ArticleUpdateDto): Promise<Article> {
		return this.databaseService.client.article.update({
			where: { id },
			data,
		});
	}

	async deleteArticle(id: number): Promise<Article> {
		return this.databaseService.client.article.delete({
			where: { id },
		});
	}
}
