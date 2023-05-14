import { Article } from '@prisma/client';
import { IsEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class ArticleUpdateDto implements Omit<Article, 'authorID' | 'id'> {
	@IsOptional()
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
	authorID: string;

	@IsOptional()
	@IsNumber()
	categoryID: string;

	@IsEmpty()
	createdAt: Date;

	@IsEmpty()
	updatedAt: Date;
}
