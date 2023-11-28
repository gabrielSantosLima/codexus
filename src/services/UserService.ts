import { User } from "../entities/user";

export class UserService {
  async fetchAll(): User[] {}

  async rateBook(userName: string, bookId: number, rate: number): User {}

  getAuthenticatedUser(): User {}

  async create(userName: string): User {}
}
