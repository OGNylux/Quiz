import { inject, Injectable } from '@angular/core';
import { Quiz } from './quiz';
import { Question } from './question';
import { v4 as uuidv4 } from 'uuid';
import { Preferences } from '@capacitor/preferences';
import { HttpClient } from '@angular/common/http';
import { ApiService } from './api.service';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Data {
  public currentQuiz: Quiz = {
    id: '1',
    title: 'Sample Quiz',
    questions: []
  };

  private http = inject(HttpClient);
  private apiService = inject(ApiService);

  constructor() {
    this.loadQuiz()
  }

  public async loadQuiz() {
    const ret = await Preferences.get({ key: 'it251511_mobile_2025_quiz' });
    if (ret.value) this.currentQuiz = <Quiz>JSON.parse(ret.value);
  }

  public async saveQuiz() {
    await Preferences.set({
      key: 'it251511_mobile_2025_quiz',
      value: JSON.stringify(this.currentQuiz)
    });
  }

  public getAllQuestions(): Question[] {
    return this.currentQuiz.questions || [];
  }

  public getQuestionById(id: string): Question {
    const questions = this.currentQuiz.questions || [];
    return questions.find(q => q.id === id) || this.getNewQuestion();
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
    if (!this.currentQuiz.questions) {
      this.currentQuiz.questions = [];
    }
    this.currentQuiz.questions.push(question);
    this.saveQuiz();
  }

  deleteQuestion(id: string) {
    if (this.currentQuiz.questions) {
      this.currentQuiz.questions = this.currentQuiz.questions.filter(q => q.id !== id);
      this.saveQuiz();
    }
  }

  deleteAllQuestions() {
    this.currentQuiz.questions = [];
    this.saveQuiz();
  }

  public loadFromServer() {
    this.http.get<Quiz>('assets/data.json').subscribe((data: Quiz) => {
      if (data) {
        if (data.id && data.title) {
          this.currentQuiz = data;
          this.saveQuiz();
        }
      }
    });
  }

  // New methods for backend integration
  async loadQuizzesFromBackend(): Promise<Quiz[]> {
    try {
      return await firstValueFrom(this.apiService.getAllQuizzes());
    } catch (error) {
      console.error('Error loading quizzes from backend:', error);
      return [];
    }
  }

  async loadQuestionsFromBackend(): Promise<Question[]> {
    try {
      return await firstValueFrom(this.apiService.getAllQuestions());
    } catch (error) {
      console.error('Error loading questions from backend:', error);
      return [];
    }
  }

  async loadQuizFromBackend(id: string): Promise<void> {
    try {
      const quiz = await firstValueFrom(this.apiService.getQuizById(id));
      this.currentQuiz = quiz;
      await this.saveQuiz();
    } catch (error) {
      console.error('Error loading quiz from backend:', error);
    }
  }

  async createQuizOnBackend(title: string, questions: Question[]): Promise<Quiz | null> {
    try {
      const quiz = await firstValueFrom(
        this.apiService.createQuiz({
          title,
          questions: questions.map(q => ({
            title: q.title,
            a1: q.a1,
            a2: q.a2,
            a3: q.a3,
            a4: q.a4,
            correct: q.correct
          }))
        })
      );
      return quiz;
    } catch (error) {
      console.error('Error creating quiz on backend:', error);
      return null;
    }
  }

  async syncWithBackend(): Promise<void> {
    try {
      if (!this.currentQuiz.questions) return;
      if (this.currentQuiz.questions.length > 0) {
        const createdQuiz = await this.createQuizOnBackend(
          this.currentQuiz.title || 'My Quiz',
          this.currentQuiz.questions
        );
        if (createdQuiz) {
          this.currentQuiz = createdQuiz;
          await this.saveQuiz();
        }
      }
    } catch (error) {
      console.error('Error syncing with backend:', error);
    }
  }
}
