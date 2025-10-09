import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { Data } from 'src/app/services/data';
import { Question } from 'src/app/services/question';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-question',
  templateUrl: './question.page.html',
  styleUrls: ['./question.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class QuestionPage implements OnInit {
  public data = inject(Data);
  public question!: Question;
  private route = inject(ActivatedRoute);

  constructor() { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id') || '0';

    if (id === '0') {
      this.question = this.data.getNewQuestion();
    } else {
      this.question = this.data.getQuestionById(id);
    }
  }

}
