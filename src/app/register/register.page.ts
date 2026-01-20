import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonInput, IonButton, IonText, IonSpinner, IonBackButton, IonButtons, LoadingController, ToastController, IonIcon } from '@ionic/angular/standalone';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonIcon, IonButtons, IonBackButton, RouterLink, IonSpinner, IonText, IonButton, IonInput, IonCardContent, IonCardTitle, IonCardHeader, IonCard, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class RegisterPage {
  private authService = inject(AuthService);
  private router = inject(Router);
  private loadingCtrl = inject(LoadingController);
  private toastCtrl = inject(ToastController);

  email: string = '';
  password: string = '';
  repeatPassword: string = '';
  isLoading: boolean = false;

  async register() {
    if (!this.email || !this.password || !this.repeatPassword) {
      const toast = await this.toastCtrl.create({
        message: 'Please fill in all fields',
        duration: 2000,
        color: 'warning'
      });
      await toast.present();
      return;
    }

    if (this.password !== this.repeatPassword) {
      const toast = await this.toastCtrl.create({
        message: 'Passwords do not match',
        duration: 2000,
        color: 'warning'
      });
      await toast.present();
      return;
    }

    this.isLoading = true;
    const loading = await this.loadingCtrl.create({
      message: 'Creating account...'
    });
    await loading.present();

    const result = await this.authService.register(this.email, this.password, this.repeatPassword);

    await loading.dismiss();
    this.isLoading = false;

    if (result.success) {
      const toast = await this.toastCtrl.create({
        message: 'Registration successful! Please login.',
        duration: 2000,
        color: 'success'
      });
      await toast.present();
      this.router.navigate(['/login']);
    } else {
      const toast = await this.toastCtrl.create({
        message: result.error || 'Registration failed',
        duration: 3000,
        color: 'danger'
      });
      await toast.present();
    }
  }
}
