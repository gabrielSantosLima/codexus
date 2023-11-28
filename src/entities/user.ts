import { BookRecommendation } from "./book_recommendation";

export interface User {
  name: string;
  ratings: BookRecommendation[];
}
