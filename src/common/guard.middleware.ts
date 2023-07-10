import { NextFunction, Request, Response } from 'express';
import { User } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';
import { Exception } from '../services/errors/exception.class';

import { IMiddleware } from './middleware.interface';

export class GuardMiddleware implements IMiddleware {
	private context = 'auth';
	constructor(private roles: User['role'][] = []) {}

	execute(req: Request, res: Response, next: NextFunction): void {
		if (!req.user) {
			return next(new Exception(StatusCodes.FORBIDDEN, 'User not authorized', this.context));
		}

		if (this.roles.length && !this.roles.includes(req?.user?.role)) {
			return next(new Exception(StatusCodes.UNAUTHORIZED, 'Access denied', this.context));
		}

		return next();
	}
}
