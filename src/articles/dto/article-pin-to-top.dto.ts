import { Prisma } from '@prisma/client';
import { IsBoolean } from 'class-validator';

export class ArticlePinToTopDto implements Pick<Prisma.ArticleUpdateInput, 'isPinned'> {
	@IsBoolean()
	isPinned!: boolean;
}
