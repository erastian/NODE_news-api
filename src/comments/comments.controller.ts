import { BaseController } from '../common/base.controller';
import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { TYPES } from '../constants/constants';
import { ILogger } from '../services/logger/logger.interface';
import 'reflect-metadata';
import { ValidateMiddleware } from '../common/validate.middleware';
import { StatusCodes } from 'http-status-codes';

import { ICommentsController } from './comments.controller.interface';
import { ICommentsService } from './comments.service.interface';
import { CommentCreateDto } from './dto/comment-create.dto';
import { GuardMiddleware } from '../common/guard.middleware';
import { Role } from '@prisma/client';

@injectable()
export class CommentsController extends BaseController implements ICommentsController {
	public context = 'comments';

	constructor(
		@inject(TYPES.ILogger) private logger: ILogger,
		@inject(TYPES.ICommentsService) private commentsService: ICommentsService,
	) {
		super(logger);
		this.bindRoutes(
			[
				{
					path: '/',
					method: 'post',
					func: this.createComment,
					middlewares: [new ValidateMiddleware(CommentCreateDto), new GuardMiddleware()],
				},
				{
					path: '/:id/publish',
					method: 'post',
					func: this.publishComment,
					middlewares: [new GuardMiddleware([Role.MANAGER, Role.ADMIN])],
				},
				{
					path: '/:id',
					method: 'delete',
					func: this.deleteComment,
					middlewares: [new GuardMiddleware([Role.MANAGER, Role.ADMIN])],
				},
				{
					path: '/',
					method: 'get',
					func: this.findAllComments,
					middlewares: [new GuardMiddleware([Role.MANAGER, Role.ADMIN])],
				},
				{ path: '/article/:articleID', method: 'get', func: this.findAllRelatedPublishedComments },
				{
					path: '/article/:articleID/comments',
					method: 'get',
					func: this.findAllRelatedComments,
					middlewares: [new GuardMiddleware([Role.MANAGER, Role.ADMIN])],
				},
			],
			this.context,
		);
	}

	async createComment(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const { commentBody, articleID } = req.body;
			const author = req.user;

			const result = await this.commentsService.createComment(commentBody, articleID, author.id);

			this.send(res, StatusCodes.CREATED, result);
		} catch (e) {
			return next(e);
		}
	}

	async publishComment(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const commentID = req.params.id;

			const result = await this.commentsService.publishComment(commentID);

			this.ok(res, result);
		} catch (e) {
			return next(e);
		}
	}

	async deleteComment(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const commentID = req.params.id;

			await this.commentsService.deleteComment(commentID);

			this.ok(res, `Comment ${commentID} was successfully removed.`);
		} catch (e) {
			return next(e);
		}
	}

	async findAllComments(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const result = await this.commentsService.findAllComments();

			this.ok(res, result);
		} catch (e) {
			return next(e);
		}
	}

	async findAllRelatedPublishedComments(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const articleID = req.params.articleID;

			const result = await this.commentsService.findPublishedArticleComments(articleID);

			this.ok(res, result);
		} catch (e) {
			return next(e);
		}
	}

	async findAllRelatedComments(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const articleID = req.params.articleID;

			const result = await this.commentsService.findAllArticleComments(articleID);

			this.ok(res, result);
		} catch (e) {
			return next(e);
		}
	}
}
