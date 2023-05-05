import { BaseController } from '../common/base.controller';
import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { ILogger } from '../services/logger/logger.interface';
import 'reflect-metadata';

import { IUsersController } from './users.controller.interface';
import { IUsersService } from './users.service.interface';

@injectable()
export class UsersController extends BaseController implements IUsersController {
	constructor(
		@inject(TYPES.ILogger) private loggerService: ILogger,
		@inject(TYPES.IUsersService) private usersService: IUsersService,
	) {
		super(loggerService);
		this.bindRoutes([
			{ path: '/', method: 'get', func: this.getAllUsers },
			{ path: '/profile', method: 'get', func: this.getProfile, middlewares: [] },
		]);
	}

	async getAllUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const result = await this.usersService.getAllUsers();

			this.ok(res, result);
		} catch (e) {
			return next(e);
		}
	}

	async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
		const user = req.user;
		this.ok(res, { email: user });
	}
}
