import { inject, injectable } from 'inversify';
import { PrismaClient } from '@prisma/client';
import { TYPES } from '../constants/constants';
import { ILogger } from '../services/logger/logger.interface';

@injectable()
export class DatabaseService {
	client: PrismaClient;

	constructor(@inject(TYPES.ILogger) private logger: ILogger) {
		this.client = new PrismaClient();
	}

	async connect(): Promise<void> {
		try {
			await this.client.$connect();
			this.logger.log('[DatabaseService] DB connected');
		} catch (e) {
			if (e instanceof Error) {
				this.logger.error('[DatabaseService] DB connection fault' + e.message);
			}
		}
	}

	async disconnect(): Promise<void> {
		await this.client.$disconnect();
	}
}
