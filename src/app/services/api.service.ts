import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Quiz } from './quiz';
import { Question } from './question';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  repeatPassword: string;
}

export interface UserResponse {
  id: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }

  // Authentication endpoints
  login(credentials: LoginRequest): Observable<UserResponse> {
    return this.http.post<UserResponse>(
      `${this.apiUrl}/authentication/login`,
      credentials,
      { headers: this.getHeaders(), withCredentials: true }
    );
  }

  register(credentials: RegisterRequest): Observable<UserResponse> {
    return this.http.post<UserResponse>(
      `${this.apiUrl}/authentication/register`,
      credentials,
      { headers: this.getHeaders() }
    );
  }

  // Quiz endpoints
  getAllQuizzes(): Observable<Quiz[]> {
    return this.http.get<Quiz[]>(
      `${this.apiUrl}/quizzes`,
      { withCredentials: true }
    );
  }

  getQuizById(id: string): Observable<Quiz> {
    return this.http.get<Quiz>(
      `${this.apiUrl}/quizzes/${id}`,
      { withCredentials: true }
    );
  }

  createQuiz(quiz: { title: string; questions: any[] }): Observable<Quiz> {
    return this.http.post<Quiz>(
      `${this.apiUrl}/quizzes`,
      quiz,
      { headers: this.getHeaders(), withCredentials: true }
    );
  }

  // Question endpoints
  getAllQuestions(): Observable<Question[]> {
    return this.http.get<Question[]>(
      `${this.apiUrl}/questions`,
      { withCredentials: true }
    );
  }

  getQuestionById(id: string): Observable<Question> {
    return this.http.get<Question>(
      `${this.apiUrl}/questions/${id}`,
      { withCredentials: true }
    );
  }

  createQuestion(question: Omit<Question, 'id'>): Observable<Question> {
    return this.http.post<Question>(
      `${this.apiUrl}/questions`,
      question,
      { headers: this.getHeaders(), withCredentials: true }
    );
  }
}
