import { BaseController } from '../common/base.controller';
import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { ILogger } from '../services/logger/logger.interface';
import 'reflect-metadata';
import { ValidateMiddleware } from '../common/validate.middleware';
import { StatusCodes } from 'http-status-codes';

import { ICategoriesController } from './categories.controller.interface';
import { ICategoriesService } from './categories.service.interface';
import { CategoryCreateDto } from './dto/category-create.dto';
import { CategoryUpdateDto } from './dto/category-update.dto';

@injectable()
export class CategoriesController extends BaseController implements ICategoriesController {
	constructor(
		@inject(TYPES.ILogger) private loggerService: ILogger,
		@inject(TYPES.ICategoriesService) private categoriesService: ICategoriesService,
	) {
		super(loggerService);
		this.bindRoutes([
			{ path: '/', method: 'get', func: this.getAllCategories },
			{ path: '/:url', method: 'get', func: this.getCategoryByURL },
			{
				path: '/',
				method: 'post',
				func: this.createCategory,
				middlewares: [new ValidateMiddleware(CategoryCreateDto)],
			},
			{
				path: '/:id',
				method: 'patch',
				func: this.updateCategory,
				middlewares: [new ValidateMiddleware(CategoryUpdateDto)],
			},
		]);
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

	async updateCategory(
		{ params, body }: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const id = params.id;
			const result = await this.categoriesService.updateCategory(id, body);
			this.ok(res, result);
		} catch (e) {
			next(e);
		}
	}
}
