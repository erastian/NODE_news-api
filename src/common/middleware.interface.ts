import { NextFunction, Request, Response } from 'express';
import { Exception } from '../services/errors/exception.class';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

export interface IMiddleware {
	execute:
		| ((req: Request, res: Response, next: NextFunction) => void)
		| ((
				err: Error | Exception | JsonWebTokenError | TokenExpiredError,
				req: Request,
				res: Response,
				next: NextFunction,
		  ) => void);
}
