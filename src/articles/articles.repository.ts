import { Article, Prisma } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { TYPES } from '../constants/constants';
import { DatabaseService } from '../database/prisma.service';

import { IArticlesRepository } from './articles.repository.interface';
import { ArticleCreateDto } from './dto/article-create.dto';
import { ArticleUpdateDto } from './dto/article-update.dto';

@injectable()
export class ArticlesRepository implements IArticlesRepository {
	constructor(@inject(TYPES.DatabaseService) private databaseService: DatabaseService) {}

	async findArticles(
		offset: number,
		limit: number,
		orderBy: Prisma.ArticleOrderByWithAggregationInput,
		published: boolean,
		pinned?: boolean,
	): Promise<Article[]> {
		const query = { where: { isPublished: published, isPinned: pinned } };

		return this.databaseService.client.article.findMany({
			include: {
				category: true,
				_count: {
					select: {
						comments: true,
					},
				},
			},
			skip: offset,
			take: limit,
			orderBy,
			...query,
		});
	}

	async findArticleByID(id: string): Promise<Article> {
		return this.databaseService.client.article.findUniqueOrThrow({
			where: { id },
		});
	}

	async findArticleByURL(url: string, include: Prisma.ArticleInclude | null): Promise<Article | null> {
		return this.databaseService.client.article.findUnique({
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

	async pinToTopArticle(id: string, isPinned: boolean): Promise<Article> {
		return this.databaseService.client.article.update({ where: { id }, data: { isPinned } });
	}

	async deleteArticle(id: string): Promise<Article> {
		return this.databaseService.client.article.delete({
			where: { id },
		});
	}
}
