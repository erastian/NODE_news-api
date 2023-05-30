import { User } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';

import { IUsersService } from './users.service.interface';
import { IUsersRepository } from './users.repository.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { ITokenPayload } from '../auth/auth.service';
import UserDTO from './dto/user.dto';

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

	async getProfile(userPayload: ITokenPayload): Promise<UserDTO> {
		const user = await this.getUserByEmail(userPayload.email);

		return new UserDTO(user);
	}

	createUser(data: CreateUserDto): Promise<User> {
		return this.usersRepository.createUser(data);
	}

	activateUser(id: string): Promise<User> {
		return this.usersRepository.activateUser(id);
	}

	updatePassword(id: string, password: string): Promise<User> {
		return this.usersRepository.updatePassword(id, password);
	}
}
