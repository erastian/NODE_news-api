import { Article } from '@prisma/client';
import { ArticleCreateDto } from './dto/article-create.dto';
import { ArticleUpdateDto } from './dto/article-update.dto';

export interface IArticlesRepository {
	findAllArticles: () => Promise<Article[]>;
	findArticleByID: (id: number) => Promise<Article | Error>;
	createArticle: (data: ArticleCreateDto, authorID: number) => Promise<Article>;
	updateArticle: (id: number, data: ArticleUpdateDto) => Promise<Article>;
	deleteArticle: (id: number) => Promise<Article>;
}
