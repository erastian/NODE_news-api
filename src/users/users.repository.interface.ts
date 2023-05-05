import { User } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';

export interface IUsersRepository {
	findAllUsers: () => Promise<User[]>;
	findUserByEmail: (email: string) => Promise<User>;
	findUserByID: (id: number) => Promise<User>;
	createUser: (data: CreateUserDto) => Promise<User>;
}
