import { Book } from "../entities/book";
import { BookRecommendation } from "../entities/book_recommendation";
import { User } from "../entities/user";
import { BookService } from "./BookService";

export class RecommendationService {
  constructor(private readonly bookService: BookService) {}

  vectorLength(ratings: BookRecommendation[]) {
    const sumOfSquares = ratings.reduce((total, item) => total + item.rating ** 2, 0);
    return Math.sqrt(sumOfSquares);
  }

  findRating(ratings: BookRecommendation[], bookId: number) {
    const found = ratings.find((item) => item.bookId === bookId);
    return found ? found.rating : 0;
  }

  productOfVectors(ratings1: BookRecommendation[], ratings2: BookRecommendation[]) {
    return ratings1.reduce(
      (total, item) => total + item.rating * this.findRating(ratings2, item.bookId),
      0
    );
  }

  calculateCosineSimilarity(user1: User, user2: User) {
    const ratings1 = user1.ratings;
    const ratings2 = user2.ratings;

    const dotProduct =
      this.productOfVectors(ratings1, ratings2) /
      (this.vectorLength(ratings1) * this.vectorLength(ratings2));
    console.log(dotProduct);
    return dotProduct;
  }

  findNotRatedBooks(ratings1: BookRecommendation[], ratings2: BookRecommendation[]) {
    return ratings2.filter((rating2) =>
      !ratings1.some((rating1) => rating1.bookId === rating2.bookId)
    );
  }


  async generateRecommendation(target: User, users: User[]) {
    const similarities: Record<string, number> = {};
    const notRatedBooks: number[] = [];

    for (const otherUser of users) {
      if (otherUser !== target) {
        similarities[otherUser.name] = this.calculateCosineSimilarity(
          target,
          otherUser
        );
      }
    }

    let usersInOrder = Object.keys(similarities).sort(
      (a, b) => similarities[b] - similarities[a]
    );

    usersInOrder = usersInOrder.length > 3 ? usersInOrder.slice(0, 2) : usersInOrder;

    for (const userName of usersInOrder.slice(0, 3)) {
      const user = users.find((u) => u.name === userName);
      if (user) {
          const books = this.findNotRatedBooks(target.ratings, user.ratings);
          notRatedBooks.push(
              ...books
                  .map((rating) => rating.bookId)
                  .filter((bookId) => !notRatedBooks.includes(bookId))
          );
      }
  } 
    // TODO add book fetch
    const books: Book[] = await this.bookService.fetchByIds(notRatedBooks);
    return books;
  }
}