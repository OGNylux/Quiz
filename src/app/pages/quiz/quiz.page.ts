import { Component, inject, OnInit } from '@angular/core';
import { ToastController, AlertController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonButton, IonList, IonItem, IonLabel, IonProgressBar } from '@ionic/angular/standalone';
import { Question } from 'src/app/services/question';
import { Data } from 'src/app/services/data';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.page.html',
  styleUrls: ['./quiz.page.scss'],
  standalone: true,
  imports: [IonProgressBar, IonButton, IonBackButton, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class QuizPage implements OnInit {
  public data = inject(Data);
  public question!: Question;
  private questions: Question[] = [];
  public shuffledQuestions: Question[] = [];
  public currentIndex: number = 0;
  public currentQuestion!: Question;
  public score: number = 0;

  private toastCtrl = inject(ToastController);
  private alertCtrl = inject(AlertController);

  constructor() { }

  ngOnInit() {
    this.questions = this.data.getAllQuestions();
    this.shuffledQuestions = this.shuffleArray(this.questions);
    this.currentQuestion = this.shuffledQuestions[this.currentIndex];
  }

  private shuffleArray(array: Question[]) {
    return array.sort(() => Math.random() - 0.5);
  }

  async answerQuestion(choice: number) {
    const correct = choice === this.currentQuestion.correct;
    if (correct) this.score++;

    const toast = await this.toastCtrl.create({
      message: correct ? 'Correct!' : 'Wrong!',
      duration: 1000,
      position: 'middle',
    });
    
    toast.present();

    this.currentIndex++;

    if (this.currentIndex < this.shuffledQuestions.length) this.currentQuestion = this.shuffledQuestions[this.currentIndex];
    else this.showFinalScore();
  }

  async showFinalScore() {
    const alert = await this.alertCtrl.create({
      header: 'Quiz Finished!',
      message: `Your score: ${this.score}/${this.shuffledQuestions.length}`,
      buttons: [
        {
          text: 'OK',
          handler: () => {
            history.back();
          },
        },
      ],
    });
    await alert.present();
  }

}