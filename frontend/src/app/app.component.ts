import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <mat-toolbar color="primary" class="toolbar">
      <div class="toolbar-content">
        <div class="crypto-icons">
          <mat-icon svgIcon="bitcoin"></mat-icon>
          <mat-icon svgIcon="ethereum"></mat-icon>
          <mat-icon svgIcon="defi"></mat-icon>
        </div>
        <span class="title">DeFi Portfolio Optimizer</span>
        <div class="spacer"></div>
        <button mat-icon-button>
          <mat-icon>info</mat-icon>
        </button>
      </div>
    </mat-toolbar>
    
    <div class="disclaimer-banner">
      <mat-icon>warning</mat-icon>
      <span>This is not individual investment advice. Always do your own research.</span>
    </div>
    
    <main>
      <router-outlet></router-outlet>
    </main>
    
    <footer>
      <div class="copyright">© 2025 DeFi Portfolio Optimizer. All rights reserved.</div>
    </footer>
  `,
  styles: [`
    .toolbar {
      padding: 0 24px;
      height: 70px;
    }
    .toolbar-content {
      display: flex;
      align-items: center;
      width: 100%;
    }
    .crypto-icons {
      display: flex;
      margin-right: 16px;
    }
    .crypto-icons mat-icon {
      margin-right: 8px;
      width: 28px;
      height: 28px;
    }
    .title {
      font-size: 1.4rem;
      font-weight: 500;
    }
    .spacer {
      flex: 1 1 auto;
    }
    .disclaimer-banner {
      background-color: #fff3e0;
      color: #e65100;
      padding: 8px 24px;
      display: flex;
      align-items: center;
      font-size: 0.9rem;
    }
    .disclaimer-banner mat-icon {
      margin-right: 8px;
      font-size: 20px;
    }
    main {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
      min-height: calc(100vh - 230px);
    }
    footer {
      background-color: #f5f5f5;
      padding: 30px 0 10px;
      margin-top: 40px;
    }
    .footer-content {
      display: flex;
      justify-content: space-around;
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
    }
    .footer-section {
      text-align: center;
    }
    .footer-section h4 {
      margin-bottom: 15px;
      color: #333;
    }
    .chain-icons, .social-icons {
      display: flex;
      justify-content: center;
      gap: 15px;
    }
    .chain-icons mat-icon {
      width: 30px;
      height: 30px;
    }
    .footer-section ul {
      list-style: none;
      padding: 0;
    }
    .footer-section li {
      margin-bottom: 8px;
      color: #666;
    }
    .copyright {
      text-align: center;
      margin-top: 30px;
      padding-top: 15px;
      border-top: 1px solid #ddd;
      color: #888;
      font-size: 0.8rem;
    }
  `]
})
export class AppComponent {}