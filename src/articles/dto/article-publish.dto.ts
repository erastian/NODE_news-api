import { Prisma } from '@prisma/client';
import { IsBoolean } from 'class-validator';

export class ArticlePublishDto implements Pick<Prisma.ArticleUpdateInput, 'isPublished'> {
	@IsBoolean()
	isPublished!: boolean;
}
