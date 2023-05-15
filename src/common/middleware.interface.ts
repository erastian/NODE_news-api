import { NextFunction, Request, Response } from 'express';
import { HTTPError } from '../services/errors/http-error.class';

export interface IMiddleware {
	execute:
		| ((req: Request, res: Response, next: NextFunction) => void)
		| ((err: Error | HTTPError, req: Request, res: Response, next: NextFunction) => void);
}
