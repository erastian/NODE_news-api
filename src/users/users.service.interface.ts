import { User } from '@prisma/client';
import { UserRegisterDto } from './dto/user-register.dto';

export interface IUsersService {
	getAllUsers: () => Promise<User[]>;
	registerUser: (data: UserRegisterDto) => Promise<User>;
	validateUser: (email: string, password: string) => Promise<User>;
}
