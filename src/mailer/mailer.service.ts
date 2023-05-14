import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { IConfigService } from '../config/config.service.interface';
import { TYPES } from '../types';
import NodeMailer from 'nodemailer';

import { IMailerService } from './mailer.service.interface';

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
	}

	async sendActivationMail(emailFor: string, username: string, link: string): Promise<void> {
		await this.transporter.sendMail({
			from: `Happy Admin <${this.configService.get('SMTP_USER')}>`,
			to: `${username} <${emailFor}>`,
			subject: '[Account activation] Service waiting when you activate your account',
			html: `<h4>Hi, ${username.charAt(0).toUpperCase() + username.slice(1)}! </h4>
							<p>This email was sent to you because you registered at 
							${this.configService.get('SERVER_NAME')}</p>
							<p>Here's your activation <a href="${link}" target='_blank'>link</a></p>
							<p>If it wasn't you, don't do anything. Our ultra-fashionable robot will clean up inactive registrations itself!</p> </br>
							<p>${this.configService.get('SERVER_NAME')} Team )</p>`,
		});
	}
}
