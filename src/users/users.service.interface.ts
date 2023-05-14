import { User } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';

export interface IUsersService {
	getAllUsers: () => Promise<User[]>;
	getUserByEmail: (email: string) => Promise<User>;
	getUserByID: (id: string) => Promise<User>;
	getUserByActivationLink: (activationLink: string) => Promise<User>;
	getProfile: () => Promise<User>;
	createUser: (data: CreateUserDto) => Promise<User>;
	activateUser: (user: User) => Promise<User>;
}
