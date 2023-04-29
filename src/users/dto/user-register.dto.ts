import { User } from '@prisma/client';
import { IsDefined, IsEmail, IsString } from 'class-validator';

export class UserRegisterDto {
	@IsDefined()
	@IsEmail()
	email: string;

	@IsDefined()
	password: string;

	@IsDefined()
	@IsString()
	username: string;
}
