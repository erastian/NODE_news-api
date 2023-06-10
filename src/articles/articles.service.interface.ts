import { Article, Prisma } from '@prisma/client';
import { ArticleCreateDto } from './dto/article-create.dto';
import { ArticleUpdateDto } from './dto/article-update.dto';
import { ITokenPayload } from '../auth/auth.service';
export interface IArticlesService {
	getAllArticles: () => Promise<Article[]>;
	getArticleByID: (articleID: string, include: Prisma.ArticleInclude | null) => Promise<Article | Error>;
	getArticleByURL: (articleURL: string) => Promise<Article>;
	createArticle: (data: ArticleCreateDto, authorID: string) => Promise<Article>;
	updateArticle: (articleID: string, user: ITokenPayload, data: ArticleUpdateDto) => Promise<Article>;
	publishArticle: (articleID: string, isPublished: boolean) => Promise<Article>;
	deleteArticle: (articleID: string, user: ITokenPayload) => Promise<Article>;
}
