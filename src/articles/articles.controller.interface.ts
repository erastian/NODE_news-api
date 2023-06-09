import { NextFunction, Request, Response, Router } from 'express';

export interface IArticlesController {
	router: Router;
	getAllArticles: (req: Request, res: Response, next: NextFunction) => void;
	getArticleByID: (req: Request, res: Response, next: NextFunction) => void;
	createArticle: (req: Request, res: Response, next: NextFunction) => void;
	updateArticle: (req: Request, res: Response, next: NextFunction) => void;
	publishArticle: (req: Request, res: Response, next: NextFunction) => void;
	deleteArticle: (req: Request, res: Response, next: NextFunction) => void;
}
