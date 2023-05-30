export interface IMailerService {
	sendActivationMail: (emailFor: string, username: string, link: string) => Promise<void>;
	sendRestorePasswordLink: (emailFor: string, username: string, link: string) => Promise<void>;
}
