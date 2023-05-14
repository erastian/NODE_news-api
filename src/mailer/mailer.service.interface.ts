export interface IMailerService {
	sendActivationMail: (emailFor: string, username: string, link: string) => Promise<void>;
}
