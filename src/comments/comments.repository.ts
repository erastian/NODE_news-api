import { Comment } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { DatabaseService } from '../database/prisma.service';

import { ICommentsRepository } from './comments.repository.interface';

@injectable()
export class CommentsRepository implements ICommentsRepository {
	constructor(@inject(TYPES.DatabaseService) private databaseService: DatabaseService) {}

	async create(commentBody: string, articleID: string, authorID: string): Promise<Comment> {
		return this.databaseService.client.comment.create({
			data: {
				commentBody,
				articleID,
				authorID,
			},
		});
	}

	async publish(id: string): Promise<Comment> {
		return this.databaseService.client.comment.update({
			where: { id },
			data: { isPublished: true },
		});
	}

	async delete(id: string): Promise<Comment> {
		return this.databaseService.client.comment.delete({ where: { id } });
	}

	async findAllComments(): Promise<Comment[]> {
		return this.databaseService.client.comment.findMany({
			include: {
				article: {
					select: {
						id: true,
						title: true,
					},
				},
				author: {
					select: {
						id: true,
						username: true,
						email: true,
					},
				},
			},
		}); //TODO: Add paginator. Better way get this query from article?
	}

	async findPublishedArticleComments(articleID: string): Promise<Comment[]> {
		return this.databaseService.client.comment.findMany({
			where: { articleID, isPublished: true },
			include: {
				article: {
					select: {
						id: true,
						title: true,
					},
				},
				author: {
					select: {
						id: true,
						username: true,
						email: true,
					},
				},
			},
			orderBy: {
				createdAt: 'asc',
			},
		});
	}

	async findAllArticleComments(articleID: string): Promise<Comment[]> {
		return this.databaseService.client.comment.findMany({
			where: { articleID },
			include: {
				article: {
					select: {
						id: true,
						title: true,
					},
				},
				author: {
					select: {
						id: true,
						username: true,
						email: true,
					},
				},
			},
			orderBy: {
				createdAt: 'asc',
			},
		});
	}
}
