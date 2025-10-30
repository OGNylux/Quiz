import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonButtons, IonBackButton, IonButton, IonIcon, IonItemSliding, IonItemOptions, IonItemOption } from '@ionic/angular/standalone';
import { Data } from 'src/app/services/data';
import { Router } from '@angular/router';

@Component({
  selector: 'app-question-list',
  templateUrl: './question-list.page.html',
  styleUrls: ['./question-list.page.scss'],
  standalone: true,
  imports: [IonItemOption, IonItemOptions, IonItemSliding, IonIcon, IonButton, IonBackButton, IonItem, IonList, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButtons]
})
export class QuestionListPage implements OnInit {
  public data = inject(Data);
  private router = inject(Router);

  constructor() {

  }

  public show(id: string) {
    this.router.navigate(['/question/', id]);
  }

  ngOnInit() {
    //this.data.addSampleQuestions();
  }

  deleteQuestion(id: string) {
    this.data.deleteQuestion(id);
  }
}
