import { NextFunction, Request, Response } from 'express';
import { IExceptionFilter } from './exception.filter.interface';
import { Exception } from './exception.class';
import { inject, injectable } from 'inversify';
import { ILogger } from '../logger/logger.interface';
import { TYPES } from '../../constants/constants';
import 'reflect-metadata';
import { StatusCodes } from 'http-status-codes';
import { JsonWebTokenError } from 'jsonwebtoken';
import { Prisma } from '@prisma/client';

@injectable()
export class ExceptionFilter implements IExceptionFilter {
	constructor(@inject(TYPES.ILogger) private logger: ILogger) {}

	catch(err: Error | Exception | JsonWebTokenError, req: Request, res: Response, next: NextFunction): void {
		console.log(err.constructor);
		if (err instanceof Exception) {
			this.logger.error(`[${err.context}] ${err.statusCode} ${err.name}: ${err.message}.`);
			res.status(err.statusCode).send({ err: err.message });
		} else if (err instanceof JsonWebTokenError) {
			this.logger.error(`[auth] ${StatusCodes.UNAUTHORIZED} ${err.name}: ${err.message}`);
			res.status(StatusCodes.UNAUTHORIZED).send({ err: err.message });
		} else if (err instanceof Prisma.PrismaClientKnownRequestError) {
			if (err.code === 'P2002') {
				this.logger.error(
					`[Database] ${StatusCodes.UNPROCESSABLE_ENTITY} ${err.name}: Code ${err.code}. Unique constraint violation. New entry cannot be created. ${err.message}`,
				);
				this.logger.trace(err.stack);
				res
					.status(StatusCodes.UNPROCESSABLE_ENTITY)
					.send({ err: `[Database] Error with code ${err.code}. Unique constraint violation.` });
			} else if (err.code === 'P2025') {
				this.logger.error(`[Database] ${StatusCodes.BAD_REQUEST} ${err.name}: Code ${err.code}. ${err.message}`);
				this.logger.trace(err.stack);
				res.status(StatusCodes.BAD_REQUEST).send({ err: `Bad credentials` });
			} else {
				this.logger.error(`[Database] ${err.name}: Code ${err.code}. ${err.message}`);
				this.logger.trace(err.stack);
				res
					.status(StatusCodes.UNPROCESSABLE_ENTITY)
					.send({ err: `[Database] ${err.name}. Code ${err.code}. Something went wrong during data entry` });
			}
		} else if (err instanceof Prisma.PrismaClientValidationError) {
			this.logger.error(`[Database] ${StatusCodes.UNPROCESSABLE_ENTITY} ${err.name}: Unknown argument. ${err.message}`);
			this.logger.trace(err.stack);
			res.status(StatusCodes.UNPROCESSABLE_ENTITY).send({ err: `Unknown argument.` });
		} else {
			this.logger.error(`${StatusCodes.INTERNAL_SERVER_ERROR} ${err.name}: ${err.message}.`);
			this.logger.trace(err.message);
			res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ err: `Internal server error. Please, be patient.` });
		}
	}
}
