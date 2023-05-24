import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { BaseController } from '../common/base.controller';
import { TYPES } from '../types';
import { ILogger } from '../services/logger/logger.interface';
import { ValidateMiddleware } from '../common/validate.middleware';
import jwt from 'jsonwebtoken';
import { IConfigService } from '../config/config.service.interface';
import { StatusCodes } from 'http-status-codes';
import { HTTPError } from '../services/errors/http-error.class';

import { IAuthController } from './auth.controller.interface';
import { IAuthService } from './auth.service.interface';
import { UserRegisterDto } from './dto/user-register.dto';
import { UserLoginDto } from './dto/user-login.dto';
import UserDTO from '../users/dto/user.dto';
import { ITokenPayload } from './auth.service';
import { IUsersService } from '../users/users.service.interface';

@injectable()
export class AuthController extends BaseController implements IAuthController {
	constructor(
		@inject(TYPES.ILogger) private loggerService: ILogger,
		@inject(TYPES.IConfigService) private configService: IConfigService,
		@inject(TYPES.IAuthService) private authService: IAuthService,
		@inject(TYPES.IUsersService) private userService: IUsersService,
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
			{ path: '/token', method: 'get', func: this.getToken },
			{ path: '/forget-password', method: 'post', func: this.forgotPassword, middlewares: [] },
			{ path: '/restore-password', method: 'post', func: this.restorePassword, middlewares: [] },
			{ path: '/activate', method: 'get', func: this.activate },
		]);
	}

	async getToken(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const { refreshTokenFromRequest } = req.cookies;

			if (!refreshTokenFromRequest) {
				return next(new HTTPError(StatusCodes.FORBIDDEN, 'Access denied.'));
			}

			const userFromToken = jwt.verify(
				refreshTokenFromRequest,
				this.configService.get('JWT_REFRESH_SECRET'),
			) as ITokenPayload;

			const user = await this.userService.getUserByEmail(userFromToken.email);

			const { token: accessToken } = this.authService.getAuthToken(user);
			const { cookie: refreshToken } = this.authService.getRefreshToken(user);

			res.setHeader('Set-Cookie', [refreshToken]);

			this.ok(res, { accessToken });
		} catch (e) {
			return next(e);
		}
	}

	async activate(req: Request, res: Response, next: NextFunction): Promise<void> {
		const { token: activationToken } = req.query;

		try {
			await this.authService.activateUser(`${activationToken}`);

			this.ok(res, 'User was successfully activated.');
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

			const { token: accessToken } = this.authService.getAuthToken(user);
			const { cookie: refreshToken } = this.authService.getRefreshToken(user);

			res.setHeader('Set-Cookie', [refreshToken]);

			this.ok(res, { user: new UserDTO(user), accessToken });
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
		try {
			res.clearCookie('refreshToken');

			this.ok(res, 'Good bye!');
		} catch (e) {
			return next(e);
		}
	}
}
