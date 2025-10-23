import { Injectable } from '@angular/core';
import { Quiz } from './quiz';
import { Question } from './question';
import { v4 as uuidv4 } from 'uuid';
import { Preferences } from '@capacitor/preferences';

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
    this.loadQuiz()
  }
  
  public async loadQuiz() {
    const ret = await Preferences.get({ key: 'it251511_mobile_2025_quiz' });
    if (ret.value) this.currentQuiz = <Quiz> JSON.parse(ret.value);
  }

  public async saveQuiz() {
    await Preferences.set({
      key: 'it251511_mobile_2025_quiz',
      value: JSON.stringify(this.currentQuiz)
    });
  }

  public getAllQuestions(): Question[] {
    return this.currentQuiz.questions;
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
  
  addQuestion(question: Question) {
    question.id = uuidv4();
    this.currentQuiz.questions.push(question);
    this.saveQuiz();
  }

  deleteQuestion(id: string) {
    this.currentQuiz.questions = this.currentQuiz.questions.filter(q => q.id !== id);
    this.saveQuiz();
  }

  deleteAllQuestions() {
    this.currentQuiz.questions = [];
    this.saveQuiz();
  }

  addSampleQuestions() {
    fetch('assets/questions.json')
      .then(response => response.json())
      .then((data: Question[]) => {
        data.forEach(q => q.id = uuidv4());
        
        this.deleteAllQuestions();
        this.currentQuiz.questions.push(...data);
        this.saveQuiz();
      });
  }
}
