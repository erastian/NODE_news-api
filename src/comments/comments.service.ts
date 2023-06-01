import { Comment } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';

import { ICommentsService } from './comments.service.interface';
import { ICommentsRepository } from './comments.repository.interface';

@injectable()
export class CommentsService implements ICommentsService {
	constructor(@inject(TYPES.ICommentsRepository) private commentsRepository: ICommentsRepository) {}

	createComment(commentBody: string, articleID: string, authorID: string): Promise<Comment> {
		return this.commentsRepository.create(commentBody, articleID, authorID);
	}

	publishComment(id: string): Promise<Comment> {
		return this.commentsRepository.publish(id);
	}

	deleteComment(id: string): Promise<Comment> {
		return this.commentsRepository.delete(id);
	}

	findAllComments(): Promise<Comment[]> {
		return this.commentsRepository.findAllComments();
	}

	findArticleComments(articleID: string, published: boolean | null): Promise<Comment[]> {
		return this.commentsRepository.findArticleComments(articleID, published);
	}
}
