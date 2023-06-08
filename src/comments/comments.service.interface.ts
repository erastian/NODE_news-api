import { Comment } from '@prisma/client';

export interface ICommentsService {
	createComment: (commentBody: string, articleID: string, authorID: string) => Promise<Comment>;
	publishComment: (id: string) => Promise<Comment>;
	deleteComment: (id: string) => Promise<Comment>;
	findAllComments: () => Promise<Comment[]>;
	findPublishedArticleComments: (id: string) => Promise<Comment[]>;
	findAllArticleComments: (id: string) => Promise<Comment[]>;
}
