import { NextFunction, Request, Response, Router } from 'express';
export interface IUsersController {
	router: Router;
	getAllUsers: (req: Request, res: Response, next: NextFunction) => void;
	registerUser: (req: Request, res: Response, next: NextFunction) => void;
	loginUser: (req: Request, res: Response, next: NextFunction) => void;
}
