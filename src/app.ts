import express, { Express } from 'express';
import { Server } from 'http';
import cors from 'cors';
import { ILogger } from './services/logger/logger.interface';
import { inject, injectable } from 'inversify';
import { TYPES } from './constants/constants';
import { PORT } from './constants/constants';
import { StatusCodes } from 'http-status-codes';
import 'reflect-metadata';
import { IExceptionFilter } from './services/errors/exception.filter.interface';
import { DatabaseService } from './database/prisma.service';
import { IConfigService } from './config/config.service.interface';
import { AuthMiddleware } from './common/auth.middleware';

import { IAuthController } from './auth/auth.controller.interface';
import { IArticlesController } from './articles/articles.controller.interface';
import { ICategoriesController } from './categories/categories.controller.interface';
import { ICommentsController } from './comments/comments.controller.interface';
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
		@inject(TYPES.IAuthController) private authController: IAuthController,
		@inject(TYPES.IArticlesController) private articlesController: IArticlesController,
		@inject(TYPES.ICategoriesController) private categoriesController: ICategoriesController,
		@inject(TYPES.ICommentsController) private commentsController: ICommentsController,
		@inject(TYPES.IUsersController) private usersController: IUsersController,
	) {
		this.app = express();
		this.port = PORT;
	}

	useMiddleware(): void {
		this.app.use(express.json());
		this.app.use(
			cors({
				credentials: true,
				origin: this.configService.get('CLIENT_URL'),
			}),
		);
		const authMiddleware = new AuthMiddleware(this.configService.get('JWT_SECRET'));
		this.app.use(authMiddleware.execute.bind(authMiddleware));
	}

	useRoutes(): void {
		this.app.use('/auth', this.authController.router);
		this.app.use('/articles', this.articlesController.router);
		this.app.use('/category', this.categoriesController.router);
		this.app.use('/users', this.usersController.router);
		this.app.use('/comments', this.commentsController.router);
	}

	useExceptionFilters(): void {
		this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
		this.app.use('*', (req, res) => res.status(StatusCodes.NOT_FOUND).json({ message: 'Resource not found' }));
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
