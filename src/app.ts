import express, { Express } from 'express';
import { Server } from 'http';
import { IExceptionFilter } from './services/errors/exception.filter.interface';
import { ILogger } from './services/logger/logger.interface';
import { inject, injectable } from 'inversify';
import { TYPES } from './types';
import 'reflect-metadata';
import { IConfigService } from './config/config.service.interface';
import { DatabaseService } from './database/prisma.service';

import { IArticlesController } from './articles/articles.controller.interface';
import { ICategoriesController } from './categories/categories.controller.interface';
import { IUsersController } from './users/users.controller.interface';

@injectable()
export class App {
	app: Express;
	server: Server;
	port: number;

	constructor(
		@inject(TYPES.ILogger) private logger: ILogger,
		@inject(TYPES.IExceptionFilter) private exceptionFilter: IExceptionFilter,
		@inject(TYPES.IConfigService) private configService: IConfigService,
		@inject(TYPES.DatabaseService) private databaseService: DatabaseService,
		@inject(TYPES.IArticlesController) private articlesController: IArticlesController,
		@inject(TYPES.ICategoriesController) private categoriesController: ICategoriesController,
		@inject(TYPES.IUsersController) private usersController: IUsersController,
	) {
		this.app = express();
		this.port = 8000;
	}

	useMiddleware(): void {
		this.app.use(express.json());
	}

	useRoutes(): void {
		this.app.use('/articles', this.articlesController.router);
		this.app.use('/category', this.categoriesController.router);
		this.app.use('/users', this.usersController.router);
	}

	useExceptionFilters(): void {
		this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
	}

	public async init(): Promise<void> {
		this.useMiddleware();
		this.useRoutes();
		this.useExceptionFilters();
		await this.databaseService.connect();
		this.server = this.app.listen(this.port);
		this.logger.log(`Server run at http://localhost:${this.port}`);
	}

	public async close() {
		await this.databaseService.disconnect();
		await this.server.close();
		this.logger.warn('\n\n\nSIGTERM signal detected. DB service shutdown. HTTP server shutdown.\n\n\n');
	}
}
