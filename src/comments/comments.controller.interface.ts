import { NextFunction, Request, Response, Router } from 'express';

export interface ICommentsController {
	router: Router;
	createComment: (req: Request, res: Response, next: NextFunction) => void;
	publishComment: (req: Request, res: Response, next: NextFunction) => void;
	deleteComment: (req: Request, res: Response, next: NextFunction) => void;
	findAllComments: (req: Request, res: Response, next: NextFunction) => void;
	findAllRelatedPublishedComments: (req: Request, res: Response, next: NextFunction) => void;
	findAllRelatedComments: (req: Request, res: Response, next: NextFunction) => void;
}
