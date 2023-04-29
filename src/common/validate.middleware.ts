import { IMiddleware } from './middleware.interface';
import { NextFunction, Request, Response } from 'express';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

export class ValidateMiddleware implements IMiddleware {
	constructor(private classToValidate: ClassConstructor<object>) {}
	execute({ body }: Request, res: Response, next: NextFunction): void {
		const instance = plainToInstance(this.classToValidate, body);
		validate(instance).then((error) => {
			if (error.length > 0) {
				res.status(422).send(error);
			} else {
				next();
			}
		});
	}
}
