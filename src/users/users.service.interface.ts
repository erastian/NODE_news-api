import { User } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { ITokenPayload } from '../auth/auth.service';
import UserDTO from './dto/user.dto';

export interface IUsersService {
	getAllUsers: () => Promise<User[]>;
	getUserByEmail: (email: string) => Promise<User>;
	getUserByID: (id: string) => Promise<User>;
	getProfile: (userPayload: ITokenPayload) => Promise<UserDTO>;
	createUser: (data: CreateUserDto) => Promise<User>;
	activateUser: (id: string) => Promise<User>;
}
