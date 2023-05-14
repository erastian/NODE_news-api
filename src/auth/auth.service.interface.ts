import { User } from '@prisma/client';
import { UserRegisterDto } from './dto/user-register.dto';

export interface IAuthService {
	registerUser: (data: UserRegisterDto) => Promise<User>;
	activateUser: (activationLink: string) => Promise<User>;
	userIsValidated: (email: string, rawPassword: string) => Promise<User>;
	comparePassword: (rawPassword: string, hashedPassword: string) => Promise<void>;
	cryptPassword: (rawPassword: string) => Promise<string>;
	getAuthToken: (user: User) => Promise<{ token: string; cookie: string }>;
	getRefreshToken: (user: User) => Promise<{ token: string; cookie: string }>;
}
