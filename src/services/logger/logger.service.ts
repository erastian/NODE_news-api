import { Logger } from 'tslog';
import { ILogger } from './logger.interface';
import { injectable } from 'inversify';
import 'reflect-metadata';

@injectable()
export class logger implements ILogger {
	public logger: Logger<object>;

	constructor() {
		this.logger = new Logger({
			minLevel: 3,
			prettyLogTemplate: '{{yyyy}}.{{mm}}.{{dd}} {{hh}}:{{MM}}:{{ss}}:{{ms}}\t{{logLevelName}}\t',
		});
	}

	log(...args: unknown[]): void {
		this.logger.info(...args);
	}
	error(...args: unknown[]): void {
		this.logger.error(...args);
	}
	warn(...args: unknown[]): void {
		this.logger.warn(...args);
	}
	debug(...args: unknown[]): void {
		this.logger.debug(...args);
	}
	trace(...args: unknown[]): void {
		this.logger.trace(...args);
	}
}
