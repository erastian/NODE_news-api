import { User } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { IConfigService } from '../config/config.service.interface';
import { TYPES } from '../types';
import bcrypt from 'bcryptjs';
import { StatusCodes } from 'http-status-codes';
import { HTTPError } from '../services/errors/http-error.class';
import jwt, { Secret } from 'jsonwebtoken';

import { IAuthService } from './auth.service.interface';
import { UserRegisterDto } from './dto/user-register.dto';
import { IUsersService } from '../users/users.service.interface';

@injectable()
export class AuthService implements IAuthService {
	constructor(
		@inject(TYPES.IConfigService) private configService: IConfigService,
		@inject(TYPES.IUsersService) private usersService: IUsersService,
	) {}

	async registerUser({ username, email, password }: UserRegisterDto): Promise<User> {
		const hashedPassword = await this.cryptPassword(password);

		return await this.usersService.createUser({
			username,
			email,
			password: hashedPassword,
		});
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

	async getAuthToken(user: User): Promise<{ token: string }> {
		const token = jwt.sign(user, this.configService.get('JWT_ACCESS_SECRET') as Secret, {
			expiresIn: this.configService.get('JWT_ACCESS_SECRET_EXPIRATION'),
		});
		return { token };
	}

	async getRefreshToken(user: User): Promise<{ token: string }> {
		const token = jwt.sign(user, this.configService.get('JWT_REFRESH_SECRET'), {
			expiresIn: this.configService.get('JWT_REFRESH_SECRET_EXPIRATION'),
		});
		return { token };
	}
}
