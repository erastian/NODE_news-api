import { IMiddleware } from './middleware.interface';
import { NextFunction, Request, Response } from 'express';
import jwt, { Secret } from 'jsonwebtoken';

export class AuthMiddleware implements IMiddleware {
	constructor(private secret: Secret) {}

	execute(req: Request, res: Response, next: NextFunction): void {
		const token = req.headers.authorization;

		if (!token) return next();

		try {
			const result = jwt.verify(token.split(' ')[1], this.secret);
			console.log(result);
			//req.user = result;
			return next();
		} catch (e) {
			return next(e);
		}
	}
}
