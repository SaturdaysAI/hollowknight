export type TriviaCategory = "bosses" | "warrior-dreams" | "variants" | "charms" | "items";

export type TriviaQuestion = {
  id: string;
  category: TriviaCategory;
  difficulty: 1 | 2 | 3;
  question: string;
  choices: string[];
  answerIndex: number;
  link?: { group: string; slug: string };
  explain?: string;
};
