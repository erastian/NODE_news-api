import { Article, Prisma } from '@prisma/client';
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

	async findArticleByID(id: string): Promise<Article> {
		return this.databaseService.client.article.findUniqueOrThrow({
			where: { id },
		});
	}

	async findArticleByURL(url: string, include: Prisma.ArticleInclude | null): Promise<Article> {
		return this.databaseService.client.article.findUniqueOrThrow({
			include,
			where: { url },
		});
	}

	async createArticle(data: ArticleCreateDto, authorID: string): Promise<Article> {
		return this.databaseService.client.article.create({
			data: { ...data, authorID },
		});
	}

	async updateArticle(id: string, data: ArticleUpdateDto): Promise<Article> {
		return this.databaseService.client.article.update({
			where: { id },
			data,
		});
	}

	async publishArticle(id: string, isPublished: boolean): Promise<Article> {
		return this.databaseService.client.article.update({ where: { id }, data: { isPublished } });
	}

	async deleteArticle(id: string): Promise<Article> {
		return this.databaseService.client.article.delete({
			where: { id },
		});
	}
}
