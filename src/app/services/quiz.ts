import { Question } from "./question";

export interface Quiz {
    id: string;
    quizName: string;
    questions: Question[];
    
}