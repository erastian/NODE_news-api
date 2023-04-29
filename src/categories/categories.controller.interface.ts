import { NextFunction, Request, Response, Router } from 'express';

export interface ICategoriesController {
	router: Router;
	getAllCategories: (req: Request, res: Response, next: NextFunction) => void;
	getCategoryByURL: (req: Request, res: Response, next: NextFunction) => void;
	createCategory: (req: Request, res: Response, next: NextFunction) => void;
	updateCategory: (req: Request, res: Response, next: NextFunction) => void;
}
