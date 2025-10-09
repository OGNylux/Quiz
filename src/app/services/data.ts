import { Injectable } from '@angular/core';
import { Quiz } from './quiz';
import { Question } from './question';

@Injectable({
  providedIn: 'root'
})
export class Data {
  public currentQuiz: Quiz = {
    id: '1',
    quizName: 'Sample Quiz',
    questions: []
  };

  constructor() {
    this.currentQuiz.questions.push({
      id: 'q1',
      title: 'What is the capital of France?',
      a1: 'Berlin',
      a2: 'Madrid',
      a3: 'Paris',
      a4: 'Rome',
      correct: 3
    });
  }
  
  public getQuestionById(id: string): Question {
    return this.currentQuiz.questions.find(q => q.id === id) || this.getNewQuestion();
  }

  public getNewQuestion(): Question {
    return {
      id: '0',
      title: '',
      a1: '',
      a2: '',
      a3: '',
      a4: '',
      correct: 1
    };
  }
}
