import { Article } from '@prisma/client';
import { ArticleCreateDto } from './dto/article-create.dto';
import { ArticleUpdateDto } from './dto/article-update.dto';
export interface IArticlesService {
	getAllArticles: () => Promise<Article[]>;
	getArticleByID: (id: string) => Promise<Article | Error>;
	createArticle: (data: ArticleCreateDto, authorID: string) => Promise<Article>;
	updateArticle: (id: string, data: ArticleUpdateDto) => Promise<Article>;
	publishArticle: (id: string, isPublished: boolean) => Promise<Article>;
	deleteArticle: (id: string) => Promise<Article>;
}
