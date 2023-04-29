import { User } from '@prisma/client';
import { UserRegisterDto } from './dto/user-register.dto';

export interface IUsersRepository {
	findAllUsers: () => Promise<User[]>;
	findUserByEmail: (email: string) => Promise<User>;
	findUserByID: (id: number) => Promise<User>;
	createUser: (data: UserRegisterDto) => Promise<User>;
}
