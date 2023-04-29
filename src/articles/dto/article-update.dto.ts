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
	authorID: number;

	@IsOptional()
	@IsNumber()
	categoryID: number;

	@IsEmpty()
	createdAt: Date;

	@IsEmpty()
	updatedAt: Date;
}
