import { User } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { TYPES } from '../constants/constants';
import { DatabaseService } from '../database/prisma.service';

import { IUsersRepository } from './users.repository.interface';
import { CreateUserDto } from './dto/create-user.dto';

@injectable()
export class UsersRepository implements IUsersRepository {
	constructor(@inject(TYPES.DatabaseService) private databaseService: DatabaseService) {}

	async findAllUsers(): Promise<Omit<User, 'password'>[]> {
		return this.databaseService.client.user.findMany({
			select: {
				id: true,
				username: true,
				email: true,
				isActivated: true,
				role: true,
				createdAt: true,
				updatedAt: true,
			},
		});
	}

	async findUserByEmail(email: string): Promise<User> {
		return this.databaseService.client.user.findUniqueOrThrow({ where: { email } });
	}

	async findUserByID(id: string): Promise<User> {
		return this.databaseService.client.user.findUniqueOrThrow({ where: { id } });
	}

	async createUser(data: CreateUserDto): Promise<User> {
		return this.databaseService.client.user.create({ data });
	}

	async activateUser(id: string): Promise<User> {
		return this.databaseService.client.user.update({
			where: { id },
			data: {
				isActivated: true,
			},
		});
	}

	async updatePassword(userID: string, password: string): Promise<User> {
		return this.databaseService.client.user.update({
			where: { id: userID },
			data: { password },
		});
	}
}
