import { Article } from '@prisma/client';
import { IsEmpty, IsMongoId, IsOptional, IsString } from 'class-validator';

export class ArticleUpdateDto implements Omit<Article, 'authorID' | 'id'> {
	@IsOptional()
	@IsString()
	title: string;

	@IsOptional()
	@IsString()
	url: string;

	@IsEmpty()
	isPublished: boolean;

	@IsEmpty()
	isPinned: boolean;

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
	@IsMongoId()
	categoryID: string;

	@IsEmpty()
	createdAt: Date;

	@IsEmpty()
	updatedAt: Date;
}
