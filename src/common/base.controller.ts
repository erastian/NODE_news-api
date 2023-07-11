import { Response, Router } from 'express';
import { ExpressReturnType, IControllerRoute } from './route.interface';
import { ILogger } from '../services/logger/logger.interface';
import { injectable } from 'inversify';
export { Router } from 'express';
import 'reflect-metadata';
import { StatusCodes } from 'http-status-codes';

@injectable()
export abstract class BaseController {
	private readonly _router: Router;

	constructor(private loggerService: ILogger) {
		this._router = Router();
	}

	get router(): Router {
		return this._router;
	}

	public send<T>(res: Response, code: number, message: T): ExpressReturnType {
		res.type('application/json');
		return res.status(code).json(message);
	}

	public ok<T>(res: Response, message: T): ExpressReturnType {
		return this.send<T>(res, StatusCodes.OK, message);
	}

	public created(res: Response): ExpressReturnType {
		return res.sendStatus(StatusCodes.CREATED);
	}

	protected bindRoutes(routes: IControllerRoute[], context?: string): void {
		for (const route of routes) {
			this.loggerService.log(
				`[Router] [${route.method.toUpperCase()}] ${' \t\b\b\b\b\b\b\b'.padEnd(0)} ${context}${route.path}`,
			);
			const middleware = route.middlewares?.map((m) => m.execute.bind(m));
			const handler = route.func.bind(this);
			const pipeline = middleware ? [...middleware, handler] : handler;
			this.router[route.method](route.path, pipeline);
		}
	}
}
