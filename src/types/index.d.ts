import { ITokenPayload } from '../auth/auth.service';

export {};

declare global {
	namespace Express {
		interface Request {
			user: ITokenPayload;
		}
	}
}
