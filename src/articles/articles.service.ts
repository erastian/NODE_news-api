import { Article, Prisma, Role } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { IConfigService } from '../config/config.service.interface';
import { TYPES } from '../constants/constants';
import { Exception } from '../services/errors/exception.class';
import { StatusCodes } from 'http-status-codes';

import { IArticlesService } from './articles.service.interface';
import { IArticlesRepository } from './articles.repository.interface';
import { ArticleCreateDto } from './dto/article-create.dto';
import { ArticleUpdateDto } from './dto/article-update.dto';
import { ITokenPayload } from '../auth/auth.service';
import { IPaginator } from '../types/';

@injectable()
export class ArticlesService implements IArticlesService {
	constructor(
		@inject(TYPES.IConfigService) private configService: IConfigService,
		@inject(TYPES.IArticlesRepository) private articlesRepository: IArticlesRepository,
	) {}

	async getArticles(
		offset: number,
		limit: number,
		orderBy: Prisma.ArticleOrderByWithAggregationInput,
		published: boolean,
	): Promise<IPaginator<Article>> {
		const data = await this.articlesRepository.findArticles(offset, limit, orderBy, published);

		return { offset, limit, data };
	}

	async findPublishedArticles(offset: number, limit: number): Promise<IPaginator<Article>> {
		return await this.getArticles(offset, limit, { id: 'desc' }, true);
	}

	async findDraftArticles(offset: number, limit: number): Promise<IPaginator<Article>> {
		return await this.getArticles(offset, limit, { id: 'desc' }, false);
	}

	getArticleByID(articleID: string): Promise<Article> {
		return this.articlesRepository.findArticleByID(articleID);
	}

	async getArticleByURL(articleURL: string): Promise<Article> {
		const article = await this.articlesRepository.findArticleByURL(articleURL, {
			category: true,
			_count: {
				select: {
					comments: true,
				},
			},
		});

		if (!article) {
			throw new Exception(StatusCodes.NOT_FOUND, 'Article not found', ArticlesService.name);
		}

		if (!article.isPublished) {
			throw new Exception(StatusCodes.NOT_FOUND, 'Article not found', ArticlesService.name);
		}

		return article;
	}

	createArticle(data: ArticleCreateDto, authorID: string): Promise<Article> {
		return this.articlesRepository.createArticle(data, authorID);
	}

	async updateArticle(articleID: string, user: ITokenPayload, data: ArticleUpdateDto): Promise<Article> {
		const article = await this.getArticleByID(articleID);

		if (user.id !== article.authorID && user.role !== Role.ADMIN) {
			throw new Exception(StatusCodes.FORBIDDEN, 'Access denied', ArticlesService.name);
		}

		return this.articlesRepository.updateArticle(articleID, data);
	}

	publishArticle(articleID: string, isPublished: boolean): Promise<Article> {
		return this.articlesRepository.publishArticle(articleID, isPublished);
	}

	async deleteArticle(articleID: string, user: ITokenPayload): Promise<Article> {
		const article = await this.getArticleByID(articleID);

		if (user.id !== article.authorID && user.role !== Role.ADMIN) {
			throw new Exception(StatusCodes.FORBIDDEN, 'Access denied');
		}

		return this.articlesRepository.deleteArticle(articleID);
	}
}
