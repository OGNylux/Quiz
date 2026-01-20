import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonInput, IonButton, IonText, IonSpinner, LoadingController, ToastController, IonIcon } from '@ionic/angular/standalone';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonIcon, RouterLink, IonSpinner, IonText, IonButton, IonInput, IonCardContent, IonCardTitle, IonCardHeader, IonCard, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class LoginPage {
  private authService = inject(AuthService);
  private router = inject(Router);
  private loadingCtrl = inject(LoadingController);
  private toastCtrl = inject(ToastController);

  email: string = '';
  password: string = '';
  isLoading: boolean = false;

  async login() {
    if (!this.email || !this.password) {
      const toast = await this.toastCtrl.create({
        message: 'Please enter email and password',
        duration: 2000,
        color: 'warning'
      });
      await toast.present();
      return;
    }

    this.isLoading = true;
    const loading = await this.loadingCtrl.create({
      message: 'Logging in...'
    });
    await loading.present();

    const result = await this.authService.login(this.email, this.password);

    await loading.dismiss();
    this.isLoading = false;

    if (result.success) {
      const toast = await this.toastCtrl.create({
        message: 'Login successful!',
        duration: 2000,
        color: 'success'
      });
      await toast.present();
      this.router.navigate(['/home']);
    } else {
      const toast = await this.toastCtrl.create({
        message: result.error || 'Login failed',
        duration: 3000,
        color: 'danger'
      });
      await toast.present();
    }
  }
}
