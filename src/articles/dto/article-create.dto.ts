import { Article } from '@prisma/client';
import { IsString, IsOptional, IsDefined, IsEmpty, IsMongoId } from 'class-validator';

export class ArticleCreateDto implements Omit<Article, 'authorID' | 'id'> {
	@IsDefined()
	@IsString()
	title: string;

	@IsDefined()
	@IsString()
	url: string;

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
	@IsMongoId()
	categoryID: string;

	@IsEmpty()
	createdAt: Date;

	@IsEmpty()
	updatedAt: Date;
}
