import { Article } from '@prisma/client';
import { ArticleCreateDto } from './dto/article-create.dto';
import { ArticleUpdateDto } from './dto/article-update.dto';

export interface IArticlesRepository {
	findAllArticles: () => Promise<Article[]>;
	findArticleByID: (id: string) => Promise<Article | Error>;
	createArticle: (data: ArticleCreateDto, authorID: string) => Promise<Article>;
	updateArticle: (id: string, data: ArticleUpdateDto) => Promise<Article>;
	deleteArticle: (id: string) => Promise<Article>;
}
