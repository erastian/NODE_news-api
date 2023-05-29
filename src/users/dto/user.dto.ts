import { User } from '@prisma/client';

export default class UserDTO implements Partial<User> {
	public id: User['id'];
	public username: User['username'];
	public email: User['email'];
	public role: User['role'];

	constructor(user: User) {
		this.id = user.id;
		this.username = user.username;
		this.email = user.email;
		this.role = user.role;
	}
}
