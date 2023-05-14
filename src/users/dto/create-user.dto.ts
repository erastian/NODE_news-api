import { User } from '@prisma/client';
import { IsDefined, IsEmail, IsString, MinLength } from 'class-validator';
export class CreateUserDto
	implements Pick<User, 'email' | 'password' | 'username' | 'activationLink'>
{
	@IsDefined()
	@IsEmail()
	email: string;

	@IsDefined()
	@MinLength(6)
	password: string;

	@IsDefined()
	@IsString()
	username: string;

	@IsDefined()
	@IsString()
	activationLink: string;
}
