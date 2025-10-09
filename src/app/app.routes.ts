import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'question/:id',
    loadComponent: () => import('./pages/question/question.page').then( m => m.QuestionPage)
  },
  {
    path: 'question-list',
    loadComponent: () => import('./pages/question-list/question-list.page').then( m => m.QuestionListPage)
  },
];
