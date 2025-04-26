import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-home',
  template: `
    <div class="center-container">
      <mat-card class="input-card">
        <mat-card-header>
          <mat-card-title>Check Wallet Recommendations</mat-card-title>
          <mat-card-subtitle>Enter your wallet address to get personalized DeFi recommendations</mat-card-subtitle>
        </mat-card-header>
        
        <mat-card-content>
          <form (submit)="onSubmit()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Wallet Address</mat-label>
              <input matInput [formControl]="addressControl" placeholder="0x...">
              <mat-error *ngIf="addressControl.hasError('required')">
                Wallet address is required
              </mat-error>
              <mat-error *ngIf="addressControl.hasError('pattern')">
                Please enter a valid Ethereum address (0x followed by 40 hex characters)
              </mat-error>
            </mat-form-field>
            
            <button mat-raised-button color="primary" type="submit" [disabled]="addressControl.invalid || isLoading">
              <span *ngIf="!isLoading">Get Recommendations</span>
              <mat-spinner *ngIf="isLoading" diameter="24"></mat-spinner>
            </button>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .center-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: calc(100vh - 150px);
    }
    .input-card {
      width: 500px;
      padding: 20px;
    }
    .full-width {
      width: 100%;
      margin-bottom: 20px;
    }
    button {
      width: 100%;
      height: 50px;
    }
  `]
})
export class HomeComponent {
  addressControl = new FormControl('', [
    Validators.required,
    Validators.pattern(/^0x[a-fA-F0-9]{40}$/)
  ]);
  isLoading = false;

  constructor(private router: Router, private snackBar: MatSnackBar) {}

  onSubmit() {
    if (this.addressControl.invalid) return;
    
    this.isLoading = true;
    
    // Simulate API call
    setTimeout(() => {
      this.isLoading = false;
      const address = this.addressControl.value;
      
      // Mock response - in real app this would come from backend
      const walletExists = Math.random() > 0.3; // 70% chance wallet exists for demo
      
      if (walletExists) {
        this.router.navigate(['/recommendations', address]);
      } else {
        this.snackBar.open('Wallet not found or has no activity', 'Dismiss', {
          duration: 5000,
          panelClass: 'error-snackbar'
        });
      }
    }, 1500);
  }
}