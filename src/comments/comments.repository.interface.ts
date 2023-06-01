import { Comment } from '@prisma/client';

export interface ICommentsRepository {
	create: (commentBody: string, articleID: string, authorID: string) => Promise<Comment>;
	publish: (id: string) => Promise<Comment>;
	delete: (id: string) => Promise<Comment>;
	findAllComments: () => Promise<Comment[]>;
	findArticleComments: (id: string, published: boolean | null) => Promise<Comment[]>;
}
