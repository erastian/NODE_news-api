import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { BaseController } from '../common/base.controller';
import { TYPES } from '../types';
import { ILogger } from '../services/logger/logger.interface';
import { ValidateMiddleware } from '../common/validate.middleware';
import { IConfigService } from '../config/config.service.interface';

import { IAuthController } from './auth.controller.interface';
import { IAuthService } from './auth.service.interface';
import { UserRegisterDto } from './dto/user-register.dto';
import { UserLoginDto } from './dto/user-login.dto';

@injectable()
export class AuthController extends BaseController implements IAuthController {
	constructor(
		@inject(TYPES.ILogger) private loggerService: ILogger,
		@inject(TYPES.IConfigService) private configService: IConfigService,
		@inject(TYPES.IAuthService) private authService: IAuthService,
	) {
		super(loggerService);
		this.bindRoutes([
			{
				path: '/register',
				method: 'post',
				func: this.registerUser,
				middlewares: [new ValidateMiddleware(UserRegisterDto)],
			},
			{
				path: '/login',
				method: 'post',
				func: this.loginUser,
				middlewares: [new ValidateMiddleware(UserLoginDto)],
			},
			{ path: '/logout', method: 'get', func: this.logoutUser },
			{ path: '/token', method: 'get', func: this.getToken, middlewares: [] },
			{ path: '/forget-password', method: 'post', func: this.forgotPassword, middlewares: [] },
			{ path: '/restore-password', method: 'post', func: this.restorePassword, middlewares: [] },
			{ path: '/activate/:link', method: 'get', func: this.activate, middlewares: [] },
		]);
	}

	async getToken(req: Request, res: Response, next: NextFunction): Promise<void> {
		this.ok(res, {});
	}

	async activate(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const activationLink = req.params.link;
			await this.authService.activateUser(activationLink);

			return res.redirect(`http://${this.configService.get('CLIENT_URL')}`);
		} catch (e) {
			return next(e);
		}
	}

	async forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
		this.ok(res, {});
	}

	async restorePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
		this.ok(res, {});
	}

	async loginUser(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const { email, password } = req.body;
			const user = await this.authService.userIsValidated(email, password);

			const accessToken = await this.authService.getAuthToken(user);
			const refreshToken = await this.authService.getRefreshToken(user);

			res.cookie('refreshToken', refreshToken, {
				maxAge: +this.configService.get('JWT_ACCESS_SECRET_EXPIRATION'),
				httpOnly: true,
			});

			this.ok(res, { user, accessToken });
		} catch (e) {
			return next(e);
		}
	}

	async registerUser({ body }: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const { email, username, password } = body;
			await this.authService.registerUser({ email, username, password });

			this.ok(res, 'User successfully registered.');
		} catch (e) {
			return next(e);
		}
	}

	async logoutUser(req: Request, res: Response, next: NextFunction): Promise<void> {
		await this.ok(res, {});
	}
}
