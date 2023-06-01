import { Comment } from '@prisma/client';

export interface ICommentsService {
	createComment: (commentBody: string, articleID: string, authorID: string) => Promise<Comment>;
	publishComment: (id: string) => Promise<Comment>;
	deleteComment: (id: string) => Promise<Comment>;
	findAllComments: () => Promise<Comment[]>;
	findArticleComments: (id: string, published: boolean | null) => Promise<Comment[]>;
}
