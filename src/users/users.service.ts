import { User } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';

import { IUsersService } from './users.service.interface';
import { IUsersRepository } from './users.repository.interface';
import { CreateUserDto } from './dto/create-user.dto';

@injectable()
export class UsersService implements IUsersService {
	constructor(@inject(TYPES.IUsersRepository) private usersRepository: IUsersRepository) {}

	getAllUsers(): Promise<User[]> {
		return this.usersRepository.findAllUsers();
	}

	getUserByEmail(email: string): Promise<User> {
		return this.usersRepository.findUserByEmail(email);
	}

	getUserByID(id: string): Promise<User> {
		return this.usersRepository.findUserByID(id);
	}

	getUserByActivationLink(activationLink: string): Promise<User> {
		return this.usersRepository.findUserByActivationLink(activationLink);
	}

	getProfile(): Promise<User> {
		return Object();
	}

	createUser(data: CreateUserDto): Promise<User> {
		return this.usersRepository.createUser(data);
	}

	activateUser(user: User): Promise<User> {
		return this.usersRepository.activateUser(user.id);
	}
}
