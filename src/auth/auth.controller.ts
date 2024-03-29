import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { BaseController } from '../common/base.controller';
import { TYPES } from '../constants/constants';
import { ILogger } from '../services/logger/logger.interface';
import { ValidateMiddleware } from '../common/validate.middleware';
import jwt from 'jsonwebtoken';
import { IConfigService } from '../config/config.service.interface';
import { StatusCodes } from 'http-status-codes';
import { Exception } from '../services/errors/exception.class';

import { IAuthController } from './auth.controller.interface';
import { IAuthService } from './auth.service.interface';
import { UserRegisterDto } from './dto/user-register.dto';
import { UserLoginDto } from './dto/user-login.dto';
import UserDTO from '../users/dto/user.dto';
import { ForgotPasswordDTO } from './dto/forgot-password';
import { ITokenPayload } from './auth.service';
import { IUsersService } from '../users/users.service.interface';

import { GuardMiddleware } from '../common/guard.middleware';

@injectable()
export class AuthController extends BaseController implements IAuthController {
	private context = 'auth';

	constructor(
		@inject(TYPES.ILogger) private logger: ILogger,
		@inject(TYPES.IConfigService) private configService: IConfigService,
		@inject(TYPES.IAuthService) private authService: IAuthService,
		@inject(TYPES.IUsersService) private usersService: IUsersService,
	) {
		super(logger);
		this.bindRoutes(
			[
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
				{
					path: '/logout',
					method: 'get',
					func: this.logoutUser,
					middlewares: [new GuardMiddleware()],
				},
				{ path: '/token', method: 'get', func: this.getToken },
				{
					path: '/forgot-password',
					method: 'post',
					func: this.forgotPassword,
					middlewares: [new ValidateMiddleware(ForgotPasswordDTO)],
				},
				{
					path: '/update-password',
					method: 'post',
					func: this.updatePassword,
					middlewares: [new GuardMiddleware()],
				},
				{ path: '/activate', method: 'post', func: this.activate },
			],
			this.context,
		);
	}

	async getToken(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const { refreshToken } = req.cookies;

			if (!refreshToken) {
				return next(new Exception(StatusCodes.FORBIDDEN, 'Access denied.', AuthController.name));
			}

			const userFromToken = jwt.verify(refreshToken, this.configService.get('JWT_REFRESH_SECRET')) as ITokenPayload;

			const user = await this.usersService.getUserByEmail(userFromToken.email);

			const { token: accessToken } = this.authService.getAuthToken(user);
			const { cookie: refreshTokenCookie } = this.authService.getRefreshToken(user);

			res.setHeader('Set-Cookie', [refreshTokenCookie]);

			this.ok(res, { accessToken });
		} catch (e) {
			return next(e);
		}
	}

	async activate(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const user = req.user;

			await this.authService.activateUser(user.id);

			this.ok(res, 'User was successfully activated.');
		} catch (e) {
			return next(e);
		}
	}

	async forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const { email } = req.body;
			const user = await this.usersService.getUserByEmail(email);

			await this.authService.sendPasswordRestorationEmail(user);

			this.ok(res, `Restoration email for ${email} was sent.`);
		} catch (e) {
			return next(e);
		}
	}

	async updatePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const user = req.user;
			const { newPassword } = req.body;

			await this.authService.updatePassword(user.id, newPassword);

			this.ok(res, 'Password was successfully changed');
		} catch (e) {
			return next(e);
		}
	}

	async loginUser(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const { email, password } = req.body; //TODO: Add logic when user is not activated
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
