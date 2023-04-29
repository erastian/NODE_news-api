import { Article } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { IConfigService } from '../config/config.service.interface';
import { TYPES } from '../types';

import { IArticlesService } from './articles.service.interface';
import { IArticlesRepository } from './articles.repository.interface';
import { ArticleCreateDto } from './dto/article-create.dto';
import { ArticleUpdateDto } from './dto/article-update.dto';

@injectable()
export class ArticlesService implements IArticlesService {
	constructor(
		@inject(TYPES.IConfigService) private configService: IConfigService,
		@inject(TYPES.IArticlesRepository) private articlesRepository: IArticlesRepository,
	) {}

	getAllArticles(): Promise<Article[]> {
		return this.articlesRepository.findAllArticles();
	}

	getArticleByID(id: number): Promise<Article | Error> {
		return this.articlesRepository.findArticleByID(id);
	}

	createArticle(data: ArticleCreateDto, authorID: number): Promise<Article> {
		return this.articlesRepository.createArticle(data, authorID);
	}

	updateArticle(id: number, data: ArticleUpdateDto): Promise<Article> {
		return this.articlesRepository.updateArticle(id, data);
	}

	deleteArticle(id: number): Promise<Article> {
		return this.articlesRepository.deleteArticle(id);
	}
}
