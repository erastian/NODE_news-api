import { BaseController } from '../common/base.controller';
import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { ILogger } from '../services/logger/logger.interface';
import 'reflect-metadata';
import { ValidateMiddleware } from '../common/validate.middleware';
import { StatusCodes } from 'http-status-codes';
import { Role } from '@prisma/client';

import { IArticlesController } from './articles.controller.interface';
import { IArticlesService } from './articles.service.interface';
import { ArticleCreateDto } from './dto/article-create.dto';
import { ArticleUpdateDto } from './dto/article-update.dto';
import { ArticlePublishDto } from './dto/article-publish.dto';

import { GuardMiddleware } from '../common/guard.middleware';

@injectable()
export class ArticlesController extends BaseController implements IArticlesController {
	constructor(
		@inject(TYPES.ILogger) private loggerService: ILogger,
		@inject(TYPES.IArticlesService) private articleService: IArticlesService,
	) {
		super(loggerService);
		this.bindRoutes([
			{ path: '/', method: 'get', func: this.getAllArticles },
			{ path: '/:url', method: 'get', func: this.getArticleByURL },
			{
				path: '/',
				method: 'post',
				func: this.createArticle,
				middlewares: [new GuardMiddleware([Role.ADMIN, Role.MANAGER]), new ValidateMiddleware(ArticleCreateDto)],
			},
			{
				path: '/:id',
				method: 'patch',
				func: this.updateArticle,
				middlewares: [new GuardMiddleware([Role.ADMIN, Role.MANAGER]), new ValidateMiddleware(ArticleUpdateDto)],
			},
			{
				path: '/:id/publish',
				method: 'post',
				func: this.publishArticle,
				middlewares: [new GuardMiddleware([Role.ADMIN]), new ValidateMiddleware(ArticlePublishDto)],
			},
			{
				path: '/:id',
				method: 'delete',
				func: this.deleteArticle,
				middlewares: [new GuardMiddleware([Role.ADMIN])],
			},
		]);
	}

	async getAllArticles(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const result = await this.articleService.getAllArticles();
			this.ok(res, result);
		} catch (e) {
			next(e);
		}
	}

	async getArticleByURL(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const articleURL = req.params.url;

			const result = await this.articleService.getArticleByURL(articleURL);

			this.ok(res, result);
		} catch (e) {
			return next(e);
		}
	}

	async createArticle(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const author = req.user;
			const result = await this.articleService.createArticle(req.body, author.id);
			this.send(res, StatusCodes.CREATED, result);
		} catch (e) {
			next(e);
		}
	}

	async updateArticle(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const articleID = req.params.id;
			const user = req.user;

			const result = await this.articleService.updateArticle(articleID, user, req.body);

			this.ok(res, result);
		} catch (e) {
			next(e);
		}
	}

	async publishArticle(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const id = req.params.id;
			const { isPublished } = req.body;

			const result = await this.articleService.publishArticle(id, isPublished);

			this.ok(res, result);
		} catch (e) {
			return next(e);
		}
	}

	async deleteArticle(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const articleID = req.params.id;
			const user = req.user;

			await this.articleService.deleteArticle(articleID, user);
			this.ok(res, articleID);
		} catch (e) {
			next(e);
		}
	}
}
