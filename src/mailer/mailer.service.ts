import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { IConfigService } from '../config/config.service.interface';
import { TYPES } from '../types';
import NodeMailer from 'nodemailer';
import hbs, { TemplateOptions } from 'nodemailer-express-handlebars';
import { HTTPError } from '../services/errors/http-error.class';
import { StatusCodes } from 'http-status-codes';
import { Options } from 'nodemailer/lib/mailer';

import { IMailerService } from './mailer.service.interface';

type ExtendedOptions = Options & TemplateOptions;

@injectable()
export class MailerService implements IMailerService {
	private readonly transporter: NodeMailer.Transporter;

	constructor(@inject(TYPES.IConfigService) private configService: IConfigService) {
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
		const _username = username.charAt(0).toUpperCase() + username.slice(1);
		const _serverName = this.configService.get('SERVER_NAME');
		const options: ExtendedOptions = {
			from: `Happy Admin <${this.configService.get('SMTP_USER')}>`,
			to: `${username} <${emailFor}>`,
			subject: '[Account activation] Service waiting when you activate your account',
			template: 'email_user_activation',
			context: {
				username: _username,
				server_name: _serverName,
				link: link,
			},
		};

		try {
			await this.transporter.sendMail(options);
		} catch (e) {
			throw new HTTPError(StatusCodes.BAD_REQUEST, `Email to ${emailFor} was not sent.`);
		}
	}
}
