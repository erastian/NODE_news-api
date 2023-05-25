import { User } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { IConfigService } from '../config/config.service.interface';
import { TYPES } from '../types';
import bcrypt from 'bcryptjs';
import { StatusCodes } from 'http-status-codes';
import { HTTPError } from '../services/errors/http-error.class';
import jwt, { Secret } from 'jsonwebtoken';
import { IMailerService } from '../mailer/mailer.service.interface';

import { IAuthService } from './auth.service.interface';
import { UserRegisterDto } from './dto/user-register.dto';
import { IUsersService } from '../users/users.service.interface';

export interface ITokenPayload {
	id: User['id'];
	role: User['role'];
	email: User['email'];
	username: User['username'];
}

@injectable()
export class AuthService implements IAuthService {
	constructor(
		@inject(TYPES.IConfigService) private configService: IConfigService,
		@inject(TYPES.IMailerService) private mailerService: IMailerService,
		@inject(TYPES.IUsersService) private usersService: IUsersService,
	) {}

	public prepareTokenPayload({ id, role, email, username }: User): ITokenPayload {
		return { id, role, email, username };
	}
	async registerUser({ username, email, password }: UserRegisterDto): Promise<User> {
		const hashedPassword = await this.cryptPassword(password);

		const user = await this.usersService.createUser({
			username,
			email,
			password: hashedPassword,
		});
		const { token: activationLink } = this.getActivationToken(user);
		const activationURL = `http://${this.configService.get(
			'CLIENT_URL',
		)}/auth/activate?token=${activationLink}`;

		await this.mailerService.sendActivationMail(email, username, activationURL);

		return user;
	}

	async activateUser(id: string): Promise<void> {
		if (!id) {
			throw new HTTPError(StatusCodes.BAD_REQUEST, 'Wrong activation link');
		}

		const user = await this.usersService.getUserByID(id);

		await this.usersService.activateUser(user.id);
	}

	async userIsValidated(email: string, rawPassword: string): Promise<User> {
		const user = await this.usersService.getUserByEmail(email);
		await this.comparePassword(rawPassword, user.password);

		return user;
	}

	async comparePassword(rawPassword: string, hashedPassword: string): Promise<void> {
		const compareResult = await bcrypt.compare(rawPassword, hashedPassword);
		if (!compareResult) {
			throw new HTTPError(StatusCodes.UNAUTHORIZED, 'Bad credentials');
		}
	}

	async cryptPassword(rawPassword: string): Promise<string> {
		const salt = await bcrypt.genSalt(+this.configService.get('SALT'));
		return await bcrypt.hash(rawPassword, salt);
	}

	getAuthToken(user: User): { token: string; cookie: string } {
		const tokenPayload = this.prepareTokenPayload(user);
		const token = jwt.sign(tokenPayload, this.configService.get('JWT_SECRET') as Secret, {
			expiresIn: this.configService.get('JWT_ACCESS_SECRET_EXPIRATION'),
		});
		const cookie = `accessToken=${token}; HttpOnly; Max-Age=${this.configService.get(
			'JWT_ACCESS_SECRET_EXPIRATION',
		)};`;

		return { token, cookie };
	}

	getRefreshToken(user: User): { token: string; cookie: string } {
		const tokenPayload = this.prepareTokenPayload(user);
		const token = jwt.sign(tokenPayload, this.configService.get('JWT_SECRET'), {
			expiresIn: this.configService.get('JWT_REFRESH_SECRET_EXPIRATION'),
		});
		const cookie = `refreshToken=${token}; HttpOnly; Max-Age=${this.configService.get(
			'JWT_REFRESH_SECRET_EXPIRATION',
		)};`;

		return { token, cookie };
	}
	getActivationToken(user: User): { token: string } {
		const tokenPayload = this.prepareTokenPayload(user);
		const token = jwt.sign(tokenPayload, this.configService.get('JWT_SECRET') as Secret, {
			expiresIn: this.configService.get('JWT_ACTIVATION_SECRET_EXPIRATION'),
		});

		return { token };
	}
}
