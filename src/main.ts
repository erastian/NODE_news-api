import { App } from './app';
import { LoggerService } from './services/logger/logger.service';
import { IExceptionFilter } from './services/errors/exception.filter.interface';
import { ExceptionFilter } from './services/errors/exception.filter';
import { Container, ContainerModule, interfaces } from 'inversify';
import { ILogger } from './services/logger/logger.interface';
import { TYPES } from './types';
import { IConfigService } from './config/config.service.interface';
import { ConfigService } from './config/config.service';
import { DatabaseService } from './database/prisma.service';

import { ArticlesController } from './articles/articles.controller';
import { IArticlesController } from './articles/articles.controller.interface';
import { CategoriesController } from './categories/categories.controller';
import { ICategoriesController } from './categories/categories.controller.interface';
import { UsersController } from './users/users.controller';
import { IUsersController } from './users/users.controller.interface';
import { ArticlesService } from './articles/articles.service';
import { IArticlesService } from './articles/articles.service.interface';
import { CategoriesService } from './categories/categories.service';
import { ICategoriesService } from './categories/categories.service.interface';
import { UsersService } from './users/users.service';
import { IUsersService } from './users/users.service.interface';
import { ArticlesRepository } from './articles/articles.repository';
import { IArticlesRepository } from './articles/articles.repository.interface';
import { CategoriesRepository } from './categories/categories.repository';
import { ICategoriesRepository } from './categories/categories.repository.interface';
import { UsersRepository } from './users/users.repository';
import { IUsersRepository } from './users/users.repository.interface';

export interface IBootStrapReturn {
	appContainer: Container;
	app: App;
}

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<ILogger>(TYPES.ILogger).to(LoggerService).inSingletonScope();
	bind<IExceptionFilter>(TYPES.IExceptionFilter).to(ExceptionFilter);
	bind<DatabaseService>(TYPES.DatabaseService).to(DatabaseService).inSingletonScope();
	bind<IConfigService>(TYPES.IConfigService).to(ConfigService).inSingletonScope();
	bind<IArticlesController>(TYPES.IArticlesController).to(ArticlesController).inSingletonScope();
	bind<ICategoriesController>(TYPES.ICategoriesController).to(CategoriesController).inSingletonScope();
	bind<IUsersController>(TYPES.IUsersController).to(UsersController).inSingletonScope();
	bind<IArticlesService>(TYPES.IArticlesService).to(ArticlesService).inSingletonScope();
	bind<ICategoriesService>(TYPES.ICategoriesService).to(CategoriesService).inSingletonScope();
	bind<IUsersService>(TYPES.IUsersService).to(UsersService).inSingletonScope();
	bind<IArticlesRepository>(TYPES.IArticlesRepository).to(ArticlesRepository).inSingletonScope();
	bind<ICategoriesRepository>(TYPES.ICategoriesRepository).to(CategoriesRepository).inSingletonScope();
	bind<IUsersRepository>(TYPES.IUsersRepository).to(UsersRepository).inSingletonScope();
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
