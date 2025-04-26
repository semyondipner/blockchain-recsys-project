import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

interface Recommendation {
  token_name: string;
  token_photo: string;
  token_description: string;
  apy?: string;
  risk_level?: string;
  category?: string;
}

@Component({
  selector: 'app-recommendations',
  template: `
    <div class="header">
      <button mat-icon-button (click)="goBack()">
        <mat-icon>arrow_back</mat-icon>
      </button>
      <h2>Recommendations for {{ walletAddress | shortenAddress }}</h2>
    </div>
    
    <div *ngIf="isColdWallet" class="cold-wallet-notice">
      <mat-icon>info</mat-icon>
      <span>This wallet has no recent activity. Here are some popular DeFi options to get started.</span>
    </div>
    
    <div class="recommendations-grid">
      <mat-card *ngFor="let rec of recommendations" class="recommendation-card">
        <img mat-card-image [src]="rec.token_photo" [alt]="rec.token_name">
        <mat-card-header>
          <mat-card-title>{{ rec.token_name }}</mat-card-title>
          <mat-card-subtitle *ngIf="rec.apy">APY: {{ rec.apy }}</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <p>{{ rec.token_description }}</p>
          <div class="meta-info">
            <span class="category-tag">{{ rec.category }}</span>
            <span class="risk-level" [ngClass]="'risk-' + rec.risk_level">
              {{ rec.risk_level }} risk
            </span>
          </div>
        </mat-card-content>
        <mat-card-actions>
          <button mat-button color="primary">Learn More</button>
          <button mat-button color="accent">Add to Watchlist</button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .header {
      display: flex;
      align-items: center;
      margin-bottom: 30px;
    }
    .header h2 {
      margin: 0;
      margin-left: 10px;
    }
    .cold-wallet-notice {
      display: flex;
      align-items: center;
      background: #e3f2fd;
      padding: 15px;
      border-radius: 4px;
      margin-bottom: 20px;
      color: #1976d2;
    }
    .cold-wallet-notice mat-icon {
      margin-right: 10px;
    }
    .recommendations-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
    }
    .recommendation-card {
      transition: transform 0.3s;
    }
    .recommendation-card:hover {
      transform: translateY(-5px);
    }
    .meta-info {
      display: flex;
      justify-content: space-between;
      margin-top: 15px;
    }
    .category-tag {
      background: #e0e0e0;
      padding: 3px 8px;
      border-radius: 12px;
      font-size: 12px;
    }
    .risk-level {
      font-size: 12px;
      font-weight: 500;
    }
    .risk-low {
      color: #4caf50;
    }
    .risk-medium {
      color: #ff9800;
    }
    .risk-high {
      color: #f44336;
    }
  `]
})
export class RecommendationsComponent implements OnInit {
  walletAddress: string = '';
  isColdWallet: boolean = true;
  recommendations: Recommendation[] = [];

  constructor(private route: ActivatedRoute, private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.walletAddress = this.route.snapshot.params['address'];
    this.isColdWallet = Math.random() > 0.5; // Randomly determine if wallet is cold
    
    // Mock recommendations based on wallet status
    if (this.isColdWallet) {
      this.recommendations = this.getColdWalletRecommendations();
    } else {
      this.recommendations = this.getActiveWalletRecommendations();
    }
  }

  goBack() {
    window.history.back();
  }

  private getColdWalletRecommendations(): Recommendation[] {
    return [
      {
        token_name: 'Uniswap',
        token_photo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5ltVNkty8kgNMD_jaVA-Rohc1yAEyC9tM1eRm2xS-AUkmN57IaZc_4ZMv6k2H80xVQhQ&usqp=CAU',
        token_description: 'Uniswap is a decentralized trading protocol that facilitates automated trading of decentralized finance (DeFi) tokens.',
        apy: '3-10%',
        risk_level: 'medium',
        category: 'DEX'
      },
      {
        token_name: 'Aave',
        token_photo: 'https://cdn.prod.website-files.com/606f63778ec431ec1b930f1f/633ee3b889712fca0b43da1d_aave.jpg',
        token_description: 'Aave is an open-source and non-custodial protocol enabling the creation of money markets.',
        apy: '2-8%',
        risk_level: 'medium',
        category: 'Lending'
      },
      {
        token_name: 'Lido',
        token_photo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6NNJU_CHPdLXSXInpPxgFmY0DaCBeNhQp5w&s',
        token_description: 'Lido is a liquid staking solution for Ethereum that lets users stake their ETH without locking assets.',
        apy: '4-6%',
        risk_level: 'low',
        category: 'Staking'
      },
      {
        token_name: 'Curve',
        token_photo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTWJcmjMy61amlUBh0SWlAmwDy9xiL0SVb5Q&s',
        token_description: 'Curve is an exchange liquidity pool designed for extremely efficient stablecoin trading.',
        apy: '2-15%',
        risk_level: 'medium',
        category: 'Stablecoins'
      },
      {
        token_name: 'Compound',
        token_photo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLG_X-toTMhQtybhEwEdRFK7LJyLns3SblKA&s',
        token_description: 'Compound is an algorithmic, autonomous interest rate protocol built for developers.',
        apy: '1-7%',
        risk_level: 'medium',
        category: 'Lending'
      }
    ];
  }

  private getActiveWalletRecommendations(): Recommendation[] {
    return [
      {
        token_name: 'Optimism',
        token_photo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLG_X-toTMhQtybhEwEdRFK7LJyLns3SblKA&s',
        token_description: 'Optimism is a Layer 2 scaling solution for Ethereum that reduces fees and latency.',
        apy: '5-20%',
        risk_level: 'high',
        category: 'Layer 2'
      },
      {
        token_name: 'Rocket Pool',
        token_photo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLG_X-toTMhQtybhEwEdRFK7LJyLns3SblKA&s',
        token_description: 'Rocket Pool is a decentralized Ethereum staking protocol that allows users to stake with as little as 0.01 ETH.',
        apy: '4-6%',
        risk_level: 'low',
        category: 'Staking'
      },
      {
        token_name: 'Arbitrum',
        token_photo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLG_X-toTMhQtybhEwEdRFK7LJyLns3SblKA&s',
        token_description: 'Arbitrum is an optimistic rollup that scales Ethereum by moving computation off-chain.',
        apy: '8-25%',
        risk_level: 'high',
        category: 'Layer 2'
      },
      {
        token_name: 'Convex Finance',
        token_photo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLG_X-toTMhQtybhEwEdRFK7LJyLns3SblKA&s',
        token_description: 'Convex simplifies Curve Finance staking to maximize yield with minimal effort.',
        apy: '10-30%',
        risk_level: 'high',
        category: 'Yield'
      },
      {
        token_name: 'Frax Finance',
        token_photo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLG_X-toTMhQtybhEwEdRFK7LJyLns3SblKA&s',
        token_description: 'Frax is a fractional-algorithmic stablecoin protocol that aims to provide highly scalable money.',
        apy: '5-15%',
        risk_level: 'medium',
        category: 'Stablecoins'
      }
    ];
  }
}