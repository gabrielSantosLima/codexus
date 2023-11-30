import { BookRecommendation } from "../entities/book_recommendation";
import { User } from "../entities/user";
import { BookService } from "./BookService";
import { RecommendationService } from "./RecommendationService";

const LOCAL_USER = "auth";
const USERS = "users";

const recommendation = new RecommendationService(new BookService());

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

  rateBook(userName: string, bookId: number, rating: number): User | undefined {
    const foundUser = this.find(userName);
    if (!foundUser) return;
    const newRatings: BookRecommendation[] = [
      ...foundUser.ratings.filter((r) => r.bookId !== bookId),
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
    const user = localStorage.getItem(LOCAL_USER);
    if (user === undefined || user === null) return undefined;
    return this.fromJSON<User>(user);
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
    const foundUser = users.find((u) => u.name.includes(userName));
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

  // Deve retornar os IDs (bookId) dos livros recomendados
  recommendBooks(): number[] {
    const users = this.fetchAll(); // Todos os usuários. Campo 'ratings' com as informações de avaliações
    const authenticatedUser = this.getAuthenticatedUser(); // Usuário logado
    if (!authenticatedUser) return [];

    const ids = recommendation.generateRecommendation(authenticatedUser, users);
    return ids;
  }
}
