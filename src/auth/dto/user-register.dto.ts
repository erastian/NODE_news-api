import { User } from '@prisma/client';
import { IsDefined, IsEmail, IsString, MinLength } from 'class-validator';
export class UserRegisterDto implements Pick<User, 'email' | 'password' | 'username'> {
	@IsDefined()
	@IsEmail()
	email: string;

	@IsDefined()
	@MinLength(6)
	password: string;

	@IsDefined()
	@IsString()
	username: string;
}
