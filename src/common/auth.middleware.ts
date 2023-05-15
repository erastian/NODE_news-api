import { NextFunction, Request, Response } from 'express';
import jwt, { Secret } from 'jsonwebtoken';

import { IMiddleware } from './middleware.interface';
import { ITokenPayload } from '../auth/auth.service';

export class AuthMiddleware implements IMiddleware {
	constructor(private secret: Secret) {}

	execute(req: Request, res: Response, next: NextFunction): void {
		const token = req.body.token || req.query.token || req.headers['x-access-token'];

		if (!token) return next();

		try {
			req.user = jwt.verify(token, this.secret) as ITokenPayload;
			return next();
		} catch (e) {
			return next(e);
		}
	}
}
