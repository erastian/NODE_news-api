import { User } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { IConfigService } from '../config/config.service.interface';
import { TYPES } from '../types';
import bcrypt from 'bcryptjs';
import { StatusCodes } from 'http-status-codes';

import { IUsersService } from './users.service.interface';
import { UserRegisterDto } from './dto/user-register.dto';
import { IUsersRepository } from './users.repository.interface';
import { HTTPError } from '../services/errors/http-error.class';

@injectable()
export class UsersService implements IUsersService {
	constructor(
		@inject(TYPES.IConfigService) private configService: IConfigService,
		@inject(TYPES.IUsersRepository) private usersRepository: IUsersRepository,
	) {}

	getAllUsers(): Promise<User[]> {
		return this.usersRepository.findAllUsers();
	}

	async registerUser({ username, email, password }: UserRegisterDto): Promise<User> {
		const salt = await bcrypt.genSalt(+this.configService.get('SALT'));
		const encryptedPassword = await bcrypt.hash(password, salt);
		const newUser = { username, email, password: encryptedPassword };

		return await this.usersRepository.createUser(newUser);
	}

	async validateUser(email: string, receivedPassword: string): Promise<User> {
		const user = await this.usersRepository.findUserByEmail(email);
		await this.comparePassword(receivedPassword, user.password);

		return user;
	}

	async comparePassword(receivedPassword: string, passwordHash: string): Promise<void> {
		const compareResult = await bcrypt.compare(receivedPassword, passwordHash);
		if (!compareResult) {
			throw new HTTPError(StatusCodes.UNAUTHORIZED, 'Bad credentials');
		}
	}
}
