import { Category } from '@prisma/client';
import { IsDefined, IsEmpty, IsString } from 'class-validator';

export class CategoryCreateDto implements Omit<Category, 'id'> {
	@IsDefined()
	@IsString()
	title: string;

	@IsDefined()
	@IsString()
	url: string;

	@IsEmpty()
	createdAt: Date;

	@IsEmpty()
	updatedAt: Date;
}
