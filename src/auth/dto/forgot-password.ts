import { User } from '@prisma/client';
import { IsDefined, IsEmail } from 'class-validator';

export class ForgotPasswordDTO implements Pick<User, 'email'> {
	@IsDefined()
	@IsEmail()
	email: string;
}
