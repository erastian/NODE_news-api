import { Article, Prisma } from '@prisma/client';
import { ArticleCreateDto } from './dto/article-create.dto';
import { ArticleUpdateDto } from './dto/article-update.dto';

export interface IArticlesRepository {
	findArticles: (
		offset: number,
		limit: number,
		orderBy: Prisma.ArticleOrderByWithAggregationInput,
		published: boolean,
		pinned?: boolean,
	) => Promise<Article[]>;
	findArticleByID: (id: string) => Promise<Article>;
	findArticleByURL: (id: string, include: Prisma.ArticleInclude | null) => Promise<Article | null>;
	createArticle: (data: ArticleCreateDto, authorID: string) => Promise<Article>;
	updateArticle: (id: string, data: ArticleUpdateDto) => Promise<Article>;
	publishArticle: (id: string, isPublished: boolean) => Promise<Article>;
	pinToTopArticle: (id: string, isPinned: boolean) => Promise<Article>;
	deleteArticle: (id: string) => Promise<Article>;
}
