import { User } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { DatabaseService } from '../database/prisma.service';

import { IUsersRepository } from './users.repository.interface';
import { UserRegisterDto } from './dto/user-register.dto';

@injectable()
export class UsersRepository implements IUsersRepository {
	constructor(@inject(TYPES.DatabaseService) private databaseService: DatabaseService) {}

	async findAllUsers(): Promise<User[]> {
		return this.databaseService.client.user.findMany();
	}

	async findUserByEmail(email: string): Promise<User> {
		return this.databaseService.client.user.findUniqueOrThrow({ where: { email } });
	}

	async findUserByID(id: number): Promise<User> {
		return this.databaseService.client.user.findUniqueOrThrow({ where: { id } });
	}

	async createUser(data: UserRegisterDto): Promise<User> {
		return this.databaseService.client.user.create({ data });
	}
}
