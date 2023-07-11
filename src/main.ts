import { App } from './app';
import { logger } from './services/logger/logger.service';
import { IExceptionFilter } from './services/errors/exception.filter.interface';
import { ExceptionFilter } from './services/errors/exception.filter';
import { Container, ContainerModule, interfaces } from 'inversify';
import { ILogger } from './services/logger/logger.interface';
import { TYPES } from './constants/constants';
import { IConfigService } from './config/config.service.interface';
import { ConfigService } from './config/config.service';
import { DatabaseService } from './database/prisma.service';
import { MailerService } from './mailer/mailer.service';
import { IMailerService } from './mailer/mailer.service.interface';

import { AuthController } from './auth/auth.controller';
import { IAuthController } from './auth/auth.controller.interface';
import { ArticlesController } from './articles/articles.controller';
import { IArticlesController } from './articles/articles.controller.interface';
import { CategoriesController } from './categories/categories.controller';
import { ICategoriesController } from './categories/categories.controller.interface';
import { CommentsController } from './comments/comments.controller';
import { ICommentsController } from './comments/comments.controller.interface';
import { UsersController } from './users/users.controller';
import { IUsersController } from './users/users.controller.interface';
import { AuthService } from './auth/auth.service';
import { IAuthService } from './auth/auth.service.interface';
import { ArticlesService } from './articles/articles.service';
import { IArticlesService } from './articles/articles.service.interface';
import { CategoriesService } from './categories/categories.service';
import { ICategoriesService } from './categories/categories.service.interface';
import { CommentsService } from './comments/comments.service';
import { ICommentsService } from './comments/comments.service.interface';
import { UsersService } from './users/users.service';
import { IUsersService } from './users/users.service.interface';
import { ArticlesRepository } from './articles/articles.repository';
import { IArticlesRepository } from './articles/articles.repository.interface';
import { CategoriesRepository } from './categories/categories.repository';
import { ICategoriesRepository } from './categories/categories.repository.interface';
import { CommentsRepository } from './comments/comments.repository';
import { ICommentsRepository } from './comments/comments.repository.interface';
import { UsersRepository } from './users/users.repository';
import { IUsersRepository } from './users/users.repository.interface';

export interface IBootStrapReturn {
	appContainer: Container;
	app: App;
}

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<ILogger>(TYPES.ILogger).to(logger).inSingletonScope();
	bind<IConfigService>(TYPES.IConfigService).to(ConfigService).inSingletonScope();
	bind<IMailerService>(TYPES.IMailerService).to(MailerService).inSingletonScope();
	bind<IAuthController>(TYPES.IAuthController).to(AuthController).inSingletonScope();
	bind<IArticlesController>(TYPES.IArticlesController).to(ArticlesController).inSingletonScope();
	bind<ICategoriesController>(TYPES.ICategoriesController).to(CategoriesController).inSingletonScope();
	bind<ICommentsController>(TYPES.ICommentsController).to(CommentsController).inSingletonScope();
	bind<IUsersController>(TYPES.IUsersController).to(UsersController).inSingletonScope();
	bind<IAuthService>(TYPES.IAuthService).to(AuthService).inSingletonScope();
	bind<IArticlesService>(TYPES.IArticlesService).to(ArticlesService).inSingletonScope();
	bind<ICategoriesService>(TYPES.ICategoriesService).to(CategoriesService).inSingletonScope();
	bind<ICommentsService>(TYPES.ICommentsService).to(CommentsService).inSingletonScope();
	bind<IUsersService>(TYPES.IUsersService).to(UsersService).inSingletonScope();
	bind<IArticlesRepository>(TYPES.IArticlesRepository).to(ArticlesRepository).inSingletonScope();
	bind<ICategoriesRepository>(TYPES.ICategoriesRepository).to(CategoriesRepository).inSingletonScope();
	bind<ICommentsRepository>(TYPES.ICommentsRepository).to(CommentsRepository).inSingletonScope();
	bind<IUsersRepository>(TYPES.IUsersRepository).to(UsersRepository).inSingletonScope();
	bind<IExceptionFilter>(TYPES.IExceptionFilter).to(ExceptionFilter);
	bind<DatabaseService>(TYPES.DatabaseService).to(DatabaseService).inSingletonScope();
	bind<App>(TYPES.Application).to(App);
});

function bootstrap(): IBootStrapReturn {
	const appContainer = new Container();
	appContainer.load(appBindings);
	const app = appContainer.get<App>(TYPES.Application);
	app.init();

	process.on('SIGTERM', () => {
		app.close();
	});

	return { app, appContainer };
}

export const { app, appContainer } = bootstrap();
