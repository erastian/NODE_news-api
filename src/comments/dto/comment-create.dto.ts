import { Comment } from '@prisma/client';
import { IsString, IsDefined, IsEmpty } from 'class-validator';

export class CommentCreateDto implements Omit<Comment, 'authorID' | 'id'> {
	@IsDefined()
	@IsString()
	commentBody: string;

	@IsDefined()
	@IsString()
	articleID: string;

	@IsEmpty()
	isPublished: boolean;

	@IsEmpty()
	createdAt: Date;

	@IsEmpty()
	updatedAt: Date;
}
