import { BookRecommendation } from "../entities/book_recommendation";
import { User } from "../entities/user";

const LOCAL_USER = "auth";
const USERS = "users";

export class UserService {
  private fromJSON<T extends User | User[]>(data: string) {
    return JSON.parse(data) as T;
  }

  private toJSON(data: User | User[]) {
    return JSON.stringify(data);
  }

  fetchAll(): User[] {
    const data = localStorage.getItem(USERS);
    if (data === undefined || data === null) {
      localStorage.setItem(USERS, this.toJSON([]));
      return [];
    }
    return this.fromJSON<User[]>(data);
  }

  rateBook(userName: string, bookId: string, rating: number): User | undefined {
    const foundUser = this.find(userName);
    if (!foundUser) return;

    const newRatings: BookRecommendation[] = [
      ...foundUser.ratings,
      { bookId, rating, userName },
    ];

    const updatedUser: User = {
      name: foundUser.name,
      ratings: newRatings,
    };

    const newUsers = [
      ...this.fetchAll().filter((u) => u.name !== userName),
      updatedUser,
    ];

    localStorage.setItem(USERS, this.toJSON(newUsers));
    localStorage.setItem(LOCAL_USER, this.toJSON(updatedUser));
    return updatedUser;
  }

  getAuthenticatedUser(): User | null | undefined {
    const user = localStorage.getItem(LOCAL_USER) as User | null | undefined;
    return user;
  }

  logout() {
    localStorage.removeItem(LOCAL_USER);
  }

  hasAuth(): boolean {
    const user = this.getAuthenticatedUser();
    return !!user;
  }

  private find(userName: string): User | undefined {
    const users = this.fetchAll();
    const foundUser = users.find((u) => u.name === userName);
    return foundUser;
  }

  create(userName: string): User {
    let user: User = {
      name: userName,
      ratings: [],
    };

    const foundUser = this.find(userName);

    if (foundUser) {
      user = foundUser;
    } else {
      const users = this.fetchAll();
      const newUsers = [...users, user];
      localStorage.setItem(USERS, this.toJSON(newUsers));
    }

    localStorage.setItem(LOCAL_USER, this.toJSON(user));
    return user;
  }
}
