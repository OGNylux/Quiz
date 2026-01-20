import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, ToastController, ActionSheetController, IonGrid, IonRow, IonCol, IonIcon, IonButtons, AlertController } from '@ionic/angular/standalone';
import { Data } from 'src/app/services/data';
import { Quiz } from 'src/app/services/quiz';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonButtons, IonIcon, CommonModule, IonCol, IonRow, IonGrid, IonButton, IonHeader, IonToolbar, IonTitle, IonContent],
})
export class HomePage implements OnInit {
  public data = inject(Data);
  public authService = inject(AuthService);
  private router = inject(Router);
  private toastCtrl = inject(ToastController);
  private actionSheetCtrl = inject(ActionSheetController);
  private alertCtrl = inject(AlertController);
  
  public quizzes: Quiz[] = [];
  public colors = ['primary', 'secondary', 'tertiary', 'success', 'warning', 'danger', 'light', 'medium', 'dark'];

  constructor() {

  }

  ngOnInit() {
    this.loadAllQuizzes();
  }

  async loadAllQuizzes() {
    try {
      // Try to load from backend first
      const backendQuizzes = await this.data.loadQuizzesFromBackend();
      console.log('Backend quizzes:', backendQuizzes);
      
      if (backendQuizzes.length > 0) {
        this.quizzes = backendQuizzes;
      } else {
        // Try to load questions from backend (no auth required)
        const questions = await this.data.loadQuestionsFromBackend();
        if (questions.length > 0) {
          // Group questions into a quiz
          this.quizzes = [{
            id: 'backend-questions',
            title: 'Backend Questions',
            questions: questions
          }];
        } else {
          // Fallback to current quiz if no backend quizzes
          if (this.data.currentQuiz.questions && this.data.currentQuiz.questions.length > 0) {
            this.quizzes = [this.data.currentQuiz];
          }
        }
      }
    } catch (error) {
      console.error('Error loading quizzes:', error);
      // Fallback to current quiz on error
      if (this.data.currentQuiz.questions && this.data.currentQuiz.questions.length > 0) {
        this.quizzes = [this.data.currentQuiz];
      }
    }
  }

  getRandomColor(): string {
    return this.colors[Math.floor(Math.random() * this.colors.length)];
  }

  async onQuizClick(quiz: Quiz) {
    const actionSheet = await this.actionSheetCtrl.create({
      header: quiz.title,
      buttons: [
        {
          text: 'Show Questions',
          icon: 'list-outline',
          handler: () => {
            this.showQuestions(quiz);
          }
        },
        {
          text: 'Start Quiz',
          icon: 'play-outline',
          handler: () => {
            this.startQuiz(quiz);
          }
        },
        {
          text: 'Cancel',
          icon: 'close-outline',
          role: 'cancel'
        }
      ]
    });

    await actionSheet.present();
  }

  async showQuestions(quiz: Quiz) {
    await this.data.loadQuizFromBackend(quiz.id);
    this.router.navigate(['/question-list']);
  }

  async startQuiz(quiz: Quiz) {
    await this.data.loadQuizFromBackend(quiz.id);
    this.router.navigate(['/quiz']);
  }

  public async syncWithBackend() {
    await this.data.syncWithBackend();
    await this.loadAllQuizzes();
    const toast = await this.toastCtrl.create({
      message: 'Quiz synced with backend!',
      duration: 2000,
      position: 'top',
      color: 'success'
    });
    await toast.present();
  }

  public async loadFromBackend() {
    try {
      await this.loadAllQuizzes();
      if (this.quizzes.length > 0) {
        const toast = await this.toastCtrl.create({
          message: `Loaded ${this.quizzes.length} quiz(es) from backend!`,
          duration: 2000,
          position: 'top',
          color: 'success'
        });
        await toast.present();
      } else {
        const toast = await this.toastCtrl.create({
          message: 'No quizzes found. Try adding questions in the backend or login first.',
          duration: 3000,
          position: 'top',
          color: 'warning'
        });
        await toast.present();
      }
    } catch (error) {
      const toast = await this.toastCtrl.create({
        message: 'Error connecting to backend. Make sure it is running on port 3000.',
        duration: 3000,
        position: 'top',
        color: 'danger'
      });
      await toast.present();
    }
  }

  public loadLocalQuiz() {
    this.data.loadFromServer();
    setTimeout(() => this.loadAllQuizzes(), 500);
  }

  public createNewQuiz() {
    this.router.navigate(['/question-list']);
  }

  async logout() {
    const alert = await this.alertCtrl.create({
      header: 'Logout',
      message: 'Are you sure you want to logout?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Logout',
          role: 'confirm',
          handler: async () => {
            await this.authService.logout();
            this.router.navigate(['/login']);
          }
        }
      ]
    });

    await alert.present();
  }
}
