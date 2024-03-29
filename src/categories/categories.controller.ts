import { BaseController } from '../common/base.controller';
import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { TYPES } from '../constants/constants';
import { ILogger } from '../services/logger/logger.interface';
import 'reflect-metadata';
import { ValidateMiddleware } from '../common/validate.middleware';
import { StatusCodes } from 'http-status-codes';
import { Role } from '@prisma/client';

import { ICategoriesController } from './categories.controller.interface';
import { ICategoriesService } from './categories.service.interface';
import { CategoryCreateDto } from './dto/category-create.dto';
import { CategoryUpdateDto } from './dto/category-update.dto';

import { GuardMiddleware } from '../common/guard.middleware';

@injectable()
export class CategoriesController extends BaseController implements ICategoriesController {
	private context = 'categories';

	constructor(
		@inject(TYPES.ILogger) private logger: ILogger,
		@inject(TYPES.ICategoriesService) private categoriesService: ICategoriesService,
	) {
		super(logger);
		this.bindRoutes(
			[
				{ path: '/', method: 'get', func: this.getAllCategories },
				{ path: '/:url', method: 'get', func: this.getCategoryByURL },
				{
					path: '/',
					method: 'post',
					func: this.createCategory,
					middlewares: [new GuardMiddleware([Role.ADMIN, Role.MANAGER]), new ValidateMiddleware(CategoryCreateDto)],
				},
				{
					path: '/:id',
					method: 'patch',
					func: this.updateCategory,
					middlewares: [new GuardMiddleware([Role.ADMIN, Role.MANAGER]), new ValidateMiddleware(CategoryUpdateDto)],
				},
			],
			this.context,
		);
	}

	async getAllCategories(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const result = await this.categoriesService.getAllCategories();
			this.ok(res, result);
		} catch (e) {
			next(e);
		}
	}

	async getCategoryByURL({ params }: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const url = params.url;
			const result = await this.categoriesService.getCategoryByURL(url);
			this.ok(res, result);
		} catch (e) {
			next(e);
		}
	}

	async createCategory({ body }: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const result = await this.categoriesService.createCategory(body);
			this.send(res, StatusCodes.CREATED, result);
		} catch (e) {
			next(e);
		}
	}

	async updateCategory({ params, body }: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const id = params.id;
			const result = await this.categoriesService.updateCategory(id, body);
			this.ok(res, result);
		} catch (e) {
			next(e);
		}
	}
}
