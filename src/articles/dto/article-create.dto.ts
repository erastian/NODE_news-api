import { Article } from '@prisma/client';
import { IsString, IsOptional, IsDefined, IsNumber, IsEmpty } from 'class-validator';

export class ArticleCreateDto implements Omit<Article, 'authorID' | 'id'> {
	@IsDefined()
	@IsString()
	title: string;

	@IsEmpty()
	isPublished: boolean;

	@IsOptional()
	@IsString()
	description: string;

	@IsOptional()
	@IsString()
	cover: string;

	@IsOptional()
	@IsString()
	image: string;

	@IsOptional()
	@IsString()
	articleBody: string;

	@IsEmpty()
	authorID: number;

	@IsDefined()
	@IsNumber()
	categoryID: string;

	@IsEmpty()
	createdAt: Date;

	@IsEmpty()
	updatedAt: Date;
}
