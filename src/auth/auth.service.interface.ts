import { User } from '@prisma/client';
import { UserRegisterDto } from './dto/user-register.dto';
import { ITokenPayload } from './auth.service';

export interface IAuthService {
	registerUser: (data: UserRegisterDto) => Promise<User>;
	activateUser: (id: string) => Promise<void>;
	restorePassword: (user: ITokenPayload, newPassword: string) => Promise<void>;
	sendPasswordRestorationEmail: (user: User) => Promise<void>;
	userIsValidated: (email: string, rawPassword: string) => Promise<User>;
	comparePassword: (rawPassword: string, hashedPassword: string) => Promise<void>;
	cryptPassword: (rawPassword: string) => Promise<string>;
	getAuthToken: (user: User) => { token: string; cookie: string };
	getRefreshToken: (user: User) => { token: string; cookie: string };
	getActivationToken: (user: User) => { token: string };
}
