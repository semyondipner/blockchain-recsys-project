import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-home',
  template: `
    <div class="hero-section">
      <div class="hero-content">
        <h1>Optimize Your DeFi Portfolio</h1>
        <p class="subtitle">Get personalized recommendations to maximize your crypto returns</p>
        <div class="stats-grid">
          <div class="stat-card">
            <mat-icon>trending_up</mat-icon>
            <h3>+15.8%</h3>
            <p>Average APY improvement</p>
          </div>
          <div class="stat-card">
            <mat-icon>savings</mat-icon>
            <h3>$2.4B</h3>
            <p>Assets analyzed</p>
          </div>
          <div class="stat-card">
            <mat-icon>diversity_3</mat-icon>
            <h3>24,500+</h3>
            <p>Wallets optimized</p>
          </div>
        </div>
      </div>
      <div class="hero-chart">
        <img src="assets/eth.png" alt="Sample APY chart">
      </div>
    </div>

    <div class="center-container">
      <mat-card class="input-card">
        <mat-card-header>
          <mat-card-title>
            <mat-icon class="card-title-icon">search</mat-icon>
            Check Wallet Recommendations
          </mat-card-title>
          <mat-card-subtitle>Enter your wallet address to get personalized DeFi recommendations</mat-card-subtitle>
        </mat-card-header>
        
        <mat-card-content>
          <form (submit)="onSubmit()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Wallet Address</mat-label>
              <input matInput [formControl]="addressControl" placeholder="0x...">
              <mat-icon matSuffix>account_balance_wallet</mat-icon>
              <mat-error *ngIf="addressControl.hasError('required')">
                Wallet address is required
              </mat-error>
              <mat-error *ngIf="addressControl.hasError('pattern')">
                Please enter a valid Ethereum address (0x followed by 40 hex characters)
              </mat-error>
            </mat-form-field>
            
            <button mat-raised-button color="primary" type="submit" [disabled]="addressControl.invalid || isLoading" class="submit-button">
              <span *ngIf="!isLoading">
                <mat-icon>auto_awesome</mat-icon>
                Get Recommendations
              </span>
              <mat-spinner *ngIf="isLoading" diameter="24"></mat-spinner>
            </button>
          </form>
        </mat-card-content>
      </mat-card>
    </div>

    <div class="features-section">
      <h2>Why Use Our DeFi Optimizer?</h2>
      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon" style="background-color: #e3f2fd;">
            <mat-icon style="color: #1976d2;">insights</mat-icon>
          </div>
          <h3>Smart Analysis</h3>
          <p>Our AI analyzes your portfolio across multiple chains to find hidden opportunities.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon" style="background-color: #e8f5e9;">
            <mat-icon style="color: #388e3c;">paid</mat-icon>
          </div>
          <h3>Yield Optimization</h3>
          <p>Discover the highest yielding protocols with acceptable risk levels.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon" style="background-color: #f3e5f5;">
            <mat-icon style="color: #8e24aa;">security</mat-icon>
          </div>
          <h3>Risk Assessment</h3>
          <p>Get alerts about risky positions and protocol vulnerabilities.</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .hero-section {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 40px 0;
      max-width: 1200px;
      margin: 0 auto;
    }
    .hero-content {
      flex: 1;
      padding-right: 40px;
    }
    .hero-chart {
      flex: 1;
      background: #f5f5f5;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
    .hero-chart img {
      width: 100%;
      height: auto;
      border-radius: 8px;
    }
    h1 {
      font-size: 2.5rem;
      margin-bottom: 16px;
      color: #2c3e50;
    }
    .subtitle {
      font-size: 1.2rem;
      color: #7f8c8d;
      margin-bottom: 30px;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      margin: 30px 0;
    }
    .stat-card {
      background: white;
      padding: 20px;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      text-align: center;
    }
    .stat-card mat-icon {
      font-size: 36px;
      width: 36px;
      height: 36px;
      margin-bottom: 10px;
      color: #3498db;
    }
    .stat-card h3 {
      margin: 10px 0;
      font-size: 1.8rem;
      color: #2c3e50;
    }
    .stat-card p {
      color: #7f8c8d;
      margin: 0;
    }
    .center-container {
      display: flex;
      justify-content: center;
      padding: 40px 20px;
      background: #f9f9f9;
    }
    .input-card {
      width: 600px;
      padding: 30px;
      border-radius: 16px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.1);
    }
    .card-title-icon {
      vertical-align: middle;
      margin-right: 8px;
    }
    .full-width {
      width: 100%;
      margin-bottom: 24px;
    }
    .submit-button {
      width: 100%;
      height: 50px;
      font-size: 1.1rem;
    }
    .submit-button mat-icon {
      vertical-align: middle;
      margin-right: 8px;
    }
    .features-section {
      max-width: 1200px;
      margin: 60px auto;
      padding: 0 20px;
    }
    .features-section h2 {
      text-align: center;
      font-size: 2rem;
      margin-bottom: 40px;
      color: #2c3e50;
    }
    .features-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 30px;
    }
    .feature-card {
      text-align: center;
      padding: 30px 20px;
      border-radius: 12px;
      transition: transform 0.3s, box-shadow 0.3s;
    }
    .feature-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 20px rgba(0,0,0,0.1);
    }
    .feature-icon {
      width: 70px;
      height: 70px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 20px;
    }
    .feature-icon mat-icon {
      font-size: 36px;
    }
    .feature-card h3 {
      margin: 15px 0;
      font-size: 1.3rem;
      color: #2c3e50;
    }
    .feature-card p {
      color: #7f8c8d;
      line-height: 1.6;
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
    const address = this.addressControl.value;
    this.router.navigate(['/recommendations/', address]);
    this.isLoading = true;
    
  }
}