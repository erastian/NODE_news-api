import { Category } from '@prisma/client';
import { IsEmpty, IsOptional, IsString } from 'class-validator';

export class CategoryUpdateDto implements Omit<Category, 'id'> {
	@IsOptional()
	@IsString()
	title: string;

	@IsOptional()
	@IsString()
	url: string;

	@IsEmpty()
	createdAt: Date;

	@IsEmpty()
	updatedAt: Date;
}
