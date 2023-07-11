import { NextFunction, Request, Response } from 'express';
import { IExceptionFilter } from './exception.filter.interface';
import { Exception } from './exception.class';
import { inject, injectable } from 'inversify';
import { ILogger } from '../logger/logger.interface';
import { TYPES } from '../../constants/constants';
import 'reflect-metadata';
import { StatusCodes } from 'http-status-codes';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { Prisma } from '@prisma/client';

@injectable()
export class ExceptionFilter implements IExceptionFilter {
	constructor(@inject(TYPES.ILogger) private logger: ILogger) {}

	catch(
		err: Error | Exception | JsonWebTokenError | TokenExpiredError,
		req: Request,
		res: Response,
		next: NextFunction,
	): void {
		//console.log(err.constructor);
		if (err instanceof Exception) {
			this.logger.error(`[${err.context}] ${err.statusCode} ${err.name}: ${err.message}.`);
			res.status(err.statusCode).send({ err: err.message });
		} else if (err instanceof JsonWebTokenError || err instanceof TokenExpiredError) {
			this.logger.error(`[auth] ${StatusCodes.UNAUTHORIZED} ${err.name}: ${err.message}`);
			res.status(StatusCodes.UNAUTHORIZED).send({ err: err.message });
		} else if (err instanceof Prisma.PrismaClientKnownRequestError) {
			switch (err.code) {
				case 'P2002':
					this.logger.error(
						`[Database] ${StatusCodes.UNPROCESSABLE_ENTITY} ${err.name}: New article cannot be created with this url`,
					);
					res
						.status(StatusCodes.UNPROCESSABLE_ENTITY)
						.send({ err: `There is a unique constraint violation, a new article cannot be created with this url` });
					break;
				default:
					this.logger.error(`[Database] ${err.name}: ${err.code}`);
					res.status(StatusCodes.UNPROCESSABLE_ENTITY).send({ err: `[Database] Error with code ${err.code}` });
			}
		} else {
			this.logger.error(`${StatusCodes.INTERNAL_SERVER_ERROR} ${err.name}: ${err.message}.`);
			this.logger.trace(err.message);
			res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ err: err.message });
		}
	}
}
