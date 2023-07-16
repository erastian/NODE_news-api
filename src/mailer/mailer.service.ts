import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { IConfigService } from '../config/config.service.interface';
import { TYPES } from '../constants/constants';
import { SERVER_NAME } from '../constants/constants';
import NodeMailer from 'nodemailer';
import hbs, { TemplateOptions } from 'nodemailer-express-handlebars';
import { Exception } from '../services/errors/exception.class';
import { StatusCodes } from 'http-status-codes';
import { Options } from 'nodemailer/lib/mailer';

import { IMailerService } from './mailer.service.interface';
import { ILogger } from '../services/logger/logger.interface';

type ExtendedOptions = Options & TemplateOptions;

@injectable()
export class MailerService implements IMailerService {
	private readonly transporter: NodeMailer.Transporter;

	constructor(
		@inject(TYPES.ILogger) private logger: ILogger,
		@inject(TYPES.IConfigService) private configService: IConfigService,
	) {
		this.transporter = NodeMailer.createTransport({
			service: 'Hotmail',
			auth: {
				user: this.configService.get('SMTP_USER'),
				pass: this.configService.get('SMTP_PASSWORD'),
			},
		});
		this.transporter.use(
			'compile',
			hbs({
				viewEngine: {
					extname: '.hbs',
					layoutsDir: './src/mailer/templates/',
					defaultLayout: false,
					partialsDir: './src/mailer/templates/',
				},
				viewPath: './src/mailer/templates/',
				extName: '.hbs',
			}),
		);
	}

	async sendActivationMail(emailFor: string, username: string, link: string): Promise<void> {
		try {
			const capitalizeUsername = username.charAt(0).toUpperCase() + username.slice(1);
			const options: ExtendedOptions = {
				from: `Happy Admin <${this.configService.get('SMTP_USER')}>`,
				to: `${capitalizeUsername} <${emailFor}>`,
				subject: '[Account activation] Service waiting when you activate your account',
				template: 'email_user_activation',
				context: {
					username: capitalizeUsername,
					server_name: SERVER_NAME,
					link: link,
				},
			};

			await this.transporter.sendMail(options);
			this.logger.log(`${MailerService.name}] Activation email for ${emailFor} was successfully sent.`);
		} catch (e) {
			throw new Exception(StatusCodes.BAD_REQUEST, `Activation email to ${emailFor} was not sent.`, MailerService.name);
		}
	}

	async sendRestorePasswordLink(emailFor: string, username: string, link: string): Promise<void> {
		try {
			const capitalizeUsername = username.charAt(0).toUpperCase() + username.slice(1);
			const options: ExtendedOptions = {
				from: `Happy Admin <${this.configService.get('SMTP_USER')}>`,
				to: `${capitalizeUsername} <${emailFor}>`,
				subject: '[Restore password] Password restoration message',
				template: 'restore_password',
				context: {
					username: capitalizeUsername,
					server_name: SERVER_NAME,
					link: link,
				},
			};

			await this.transporter.sendMail(options);
			this.logger.log(
				`${MailerService.name}] Email with password restoration link for ${emailFor} was successfully sent.`,
			);
		} catch (e) {
			throw new Exception(
				StatusCodes.BAD_REQUEST,
				`Email with restore password link for ${emailFor} was not sent.`,
				MailerService.name,
			);
		}
	}
}
