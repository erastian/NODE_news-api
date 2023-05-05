import { NextFunction, Request, Response, Router } from 'express';

export interface IAuthController {
	router: Router;
	registerUser: (req: Request, res: Response, next: NextFunction) => void;
	loginUser: (req: Request, res: Response, next: NextFunction) => void;
	logoutUser: (req: Request, res: Response, next: NextFunction) => void;
	refreshToken: (req: Request, res: Response, next: NextFunction) => void;
}
