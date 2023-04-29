import { BaseController } from '../common/base.controller';
import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { ILogger } from '../services/logger/logger.interface';
import 'reflect-metadata';
import { ValidateMiddleware } from '../common/validate.middleware';

import { IUsersController } from './users.controller.interface';
import { IUsersService } from './users.service.interface';
import { UserRegisterDto } from './dto/user-register.dto';
import { UserLoginDto } from './dto/user-login.dto';

@injectable()
export class UsersController extends BaseController implements IUsersController {
	constructor(
		@inject(TYPES.ILogger) private loggerService: ILogger,
		@inject(TYPES.IUsersService) private usersService: IUsersService,
	) {
		super(loggerService);
		this.bindRoutes([
			{ path: '/', method: 'get', func: this.getAllUsers },
			{ path: '/register', method: 'post', func: this.registerUser, middlewares: [new ValidateMiddleware(UserRegisterDto)] },
			{ path: '/login', method: 'post', func: this.loginUser, middlewares: [new ValidateMiddleware(UserLoginDto)] },
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

	async registerUser({ body }: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const { email, username, password } = body;
			await this.usersService.registerUser({ email, username, password });

			this.ok(res, 'User registered.');
		} catch (e) {
			return next(e);
		}
	}

	async loginUser(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const { email, password } = req.body;
			const user = await this.usersService.validateUser(email, password);

			this.ok(res, { user });
		} catch (e) {
			return next(e);
		}
	}
}
