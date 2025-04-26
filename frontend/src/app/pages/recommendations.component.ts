import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

interface Recommendation {
  token_name: string;
  token_photo: string;
  token_description: string;
  apy?: string;
  risk_level?: string;
  category?: string;
  tvl?: string;
  chain?: string;
  launch_date?: string;
  audit_status?: string;
  token_price?: string;
  price_change?: string;
}

@Component({
  selector: 'app-recommendations',
  template: `
    <div class="header-container">
      <div class="header-content">
        <button mat-icon-button (click)="goBack()" class="back-button">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <div class="wallet-info">
          <div class="wallet-header">
            <mat-icon class="wallet-icon">account_balance_wallet</mat-icon>
            <h2>Portfolio Recommendations</h2>
          </div>
          <div class="wallet-address">
            <span class="address">{{ walletAddress | shortenAddress }}</span>
            <button mat-icon-button (click)="copyAddress()" matTooltip="Copy address">
              <mat-icon>content_copy</mat-icon>
            </button>
          </div>
        </div>
        <div class="wallet-status-chip" [ngClass]="{'cold': isColdWallet, 'active': !isColdWallet}">
          <mat-icon>{{ isColdWallet ? 'snowing' : 'flash_on' }}</mat-icon>
          {{ isColdWallet ? 'Cold Wallet' : 'Active Wallet' }}
        </div>
      </div>
    </div>
    
    <div *ngIf="isColdWallet" class="cold-wallet-notice">
      <div class="notice-content">
        <mat-icon>info</mat-icon>
        <div class="notice-text">
          <h3>New to DeFi?</h3>
          <p>This wallet has no recent activity. We've selected some beginner-friendly DeFi options to help you get started.</p>
        </div>
      </div>
    </div>
    
    <div class="portfolio-summary" *ngIf="!isColdWallet">
      <div class="summary-card">
        <div class="summary-icon">
          <mat-icon>show_chart</mat-icon>
        </div>
        <div class="summary-content">
          <h3>Estimated APY Boost</h3>
          <p class="highlight">+{{ estimatedApyBoost }}%</p>
        </div>
      </div>
      <div class="summary-card">
        <div class="summary-icon">
          <mat-icon>diversity_3</mat-icon>
        </div>
        <div class="summary-content">
          <h3>Diversification</h3>
          <p class="highlight">{{ diversificationScore }}/10</p>
        </div>
      </div>
      <div class="summary-card">
        <div class="summary-icon">
          <mat-icon>security</mat-icon>
        </div>
        <div class="summary-content">
          <h3>Risk Level</h3>
          <p class="highlight">{{ overallRisk }}</p>
        </div>
      </div>
    </div>
    
    <div class="recommendations-grid">
      <mat-card *ngFor="let rec of filteredRecommendations" class="recommendation-card">
        <div class="card-header">
          <img [src]="rec.token_photo" [alt]="rec.token_name" class="token-logo">
          <div class="token-header">
            <h3>{{ rec.token_name }}</h3>
            <div class="token-chain">
              <img [src]="getChainIcon(rec.chain)" class="chain-icon">
              <span>{{ rec.chain }}</span>
            </div>
          </div>
          <span class="apy-badge" [ngClass]="'risk-' + rec.risk_level">
            {{ rec.apy }} APY
          </span>
        </div>
        
        <div class="card-content">
          <p class="token-description">{{ rec.token_description }}</p>
          
          <div class="token-stats">
            <div class="stat-item">
              <mat-icon>leaderboard</mat-icon>
              <span>{{ rec.tvl }}</span>
            </div>
            <div class="stat-item">
              <mat-icon>calendar_today</mat-icon>
              <span>{{ rec.launch_date }}</span>
            </div>
            <div class="stat-item">
              <mat-icon>verified</mat-icon>
              <span>{{ rec.audit_status }}</span>
            </div>
          </div>
          
          <div class="price-info" *ngIf="rec.token_price">
            <span class="price">{{ rec.token_price }}</span>
            <span class="price-change" [ngClass]="{'positive': rec.price_change?.startsWith('+'), 'negative': rec.price_change?.startsWith('-')}">
              {{ rec.price_change }}
            </span>
          </div>
        </div>
        
        <div class="card-footer">
          <div class="category-tag">{{ rec.category }}</div>
          <div class="risk-level" [ngClass]="'risk-' + rec.risk_level">
            <mat-icon>{{ getRiskIcon(rec.risk_level) }}</mat-icon>
            {{ rec.risk_level }} risk
          </div>
        </div>
      </mat-card>
    </div>
    
    <div class="disclaimer">
      <mat-icon>warning</mat-icon>
      <p>These recommendations are generated algorithmically based on on-chain data and do not constitute financial advice. 
      Always conduct your own research before making investment decisions.</p>
    </div>
  `,
  styles: [`
    .header-container {
      background: linear-gradient(135deg, #3f51b5 0%, #2196f3 100%);
      color: white;
      padding: 20px 0;
      border-radius: 0 0 16px 16px;
      margin-bottom: 30px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
    .header-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .back-button {
      color: white;
      margin-right: 15px;
    }
    .wallet-info {
      flex: 1;
    }
    .wallet-header {
      display: flex;
      align-items: center;
      margin-bottom: 5px;
    }
    .wallet-icon {
      margin-right: 10px;
      font-size: 28px;
      width: 28px;
      height: 28px;
    }
    .wallet-header h2 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 500;
    }
    .wallet-address {
      display: flex;
      align-items: center;
    }
    .address {
      font-family: monospace;
      font-size: 0.9rem;
      opacity: 0.9;
    }
    .wallet-status-chip {
      display: flex;
      align-items: center;
      padding: 8px 16px;
      border-radius: 20px;
      font-weight: 500;
      font-size: 0.9rem;
    }
    .wallet-status-chip.cold {
      background: rgba(255,255,255,0.2);
      color: #bbdefb;
    }
    .wallet-status-chip.active {
      background: rgba(76,175,80,0.2);
      color: #a5d6a7;
    }
    .wallet-status-chip mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      margin-right: 5px;
    }
    
    .cold-wallet-notice {
      max-width: 1200px;
      margin: 0 auto 30px;
      padding: 0 20px;
    }
    .notice-content {
      background: #e3f2fd;
      border-radius: 12px;
      padding: 20px;
      display: flex;
      align-items: flex-start;
    }
    .notice-content mat-icon {
      color: #1976d2;
      margin-right: 15px;
      font-size: 28px;
      flex-shrink: 0;
    }
    .notice-text h3 {
      margin: 0 0 8px 0;
      color: #0d47a1;
    }
    .notice-text p {
      margin: 0;
      color: #1e88e5;
    }
    
    .portfolio-summary {
      max-width: 1200px;
      margin: 0 auto 30px;
      padding: 0 20px;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
    }
    .summary-card {
      background: white;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.05);
      display: flex;
      align-items: center;
    }
    .summary-icon {
      background: #e3f2fd;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 15px;
    }
    .summary-icon mat-icon {
      color: #2196f3;
    }
    .summary-content h3 {
      margin: 0 0 5px 0;
      font-size: 1rem;
      color: #757575;
    }
    .summary-content p {
      margin: 0;
      font-size: 1.4rem;
      font-weight: 600;
    }
    .highlight {
      color: #2196f3;
    }
    
    .filter-controls {
      max-width: 1200px;
      margin: 0 auto 30px;
      padding: 0 20px;
      display: flex;
      gap: 15px;
    }
    .filter-controls mat-form-field {
      flex: 1;
    }
    
    .recommendations-grid {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 25px;
    }
    .recommendation-card {
      border-radius: 16px;
      overflow: hidden;
      transition: all 0.3s ease;
      cursor: pointer;
      border: 1px solid #e0e0e0;
    }
    .recommendation-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 25px rgba(0,0,0,0.1);
    }
    .card-header {
      display: flex;
      align-items: center;
      padding: 20px;
      border-bottom: 1px solid #f5f5f5;
      position: relative;
    }
    .token-logo {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      object-fit: cover;
      margin-right: 15px;
      border: 1px solid #eee;
    }
    .token-header {
      flex: 1;
    }
    .token-header h3 {
      margin: 0 0 5px 0;
      font-size: 1.2rem;
    }
    .token-chain {
      display: flex;
      align-items: center;
      font-size: 0.8rem;
      color: #757575;
    }
    .chain-icon {
      width: 16px;
      height: 16px;
      border-radius: 50%;
      margin-right: 5px;
    }
    .apy-badge {
      position: absolute;
      top: 15px;
      right: 15px;
      padding: 5px 10px;
      border-radius: 12px;
      font-size: 0.8rem;
      font-weight: 600;
    }
    .apy-badge.risk-low {
      background: #e8f5e9;
      color: #2e7d32;
    }
    .apy-badge.risk-medium {
      background: #fff8e1;
      color: #ff8f00;
    }
    .apy-badge.risk-high {
      background: #ffebee;
      color: #c62828;
    }
    .card-content {
      padding: 20px;
    }
    .token-description {
      color: #616161;
      margin: 0 0 15px 0;
      line-height: 1.5;
    }
    .token-stats {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 15px;
      margin-bottom: 15px;
    }
    .stat-item {
      display: flex;
      align-items: center;
      font-size: 0.8rem;
      color: #757575;
    }
    .stat-item mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
      margin-right: 5px;
      color: #9e9e9e;
    }
    .price-info {
      display: flex;
      align-items: center;
      margin-top: 10px;
    }
    .price {
      font-weight: 600;
      margin-right: 10px;
    }
    .price-change {
      font-size: 0.9rem;
      font-weight: 500;
    }
    .price-change.positive {
      color: #2e7d32;
    }
    .price-change.negative {
      color: #c62828;
    }
    .card-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px 20px;
      border-top: 1px solid #f5f5f5;
    }
    .category-tag {
      background: #e0e0e0;
      padding: 5px 10px;
      border-radius: 12px;
      font-size: 0.8rem;
      color: #424242;
    }
    .risk-level {
      display: flex;
      align-items: center;
      font-size: 0.8rem;
      font-weight: 500;
    }
    .risk-level mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
      margin-right: 5px;
    }
    .risk-level.risk-low {
      color: #2e7d32;
    }
    .risk-level.risk-medium {
      color: #ff8f00;
    }
    .risk-level.risk-high {
      color: #c62828;
    }
    
    .disclaimer {
      max-width: 1200px;
      margin: 40px auto 20px;
      padding: 0 20px;
      display: flex;
      align-items: flex-start;
      background: #fff8e1;
      padding: 15px 20px;
      border-radius: 8px;
    }
    .disclaimer mat-icon {
      color: #ff8f00;
      margin-right: 10px;
      flex-shrink: 0;
    }
    .disclaimer p {
      margin: 0;
      font-size: 0.9rem;
      color: #5d4037;
    }
  `]
})
export class RecommendationsComponent implements OnInit {
  walletAddress: string = '';
  isColdWallet: boolean = true;
  recommendations: Recommendation[] = [];
  filteredRecommendations: Recommendation[] = [];
  
  // Filter controls
  selectedCategory: string[] = ['all'];
  selectedRisk: string[] = ['all'];
  sortBy: string = 'apy';
  
  // Portfolio summary data
  estimatedApyBoost: number = 0;
  diversificationScore: number = 0;
  overallRisk: string = '';
  
  // Available categories
  categories: string[] = ['DEX', 'Lending', 'Staking', 'Stablecoins', 'Yield', 'Layer 2', 'Derivatives'];

  constructor(
    private route: ActivatedRoute, 
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.walletAddress = this.route.snapshot.params['address'];
    this.isColdWallet = Math.random() > 0.5; // Randomly determine if wallet is cold
    
    // Mock recommendations based on wallet status
    if (this.isColdWallet) {
      this.recommendations = this.getColdWalletRecommendations();
      this.estimatedApyBoost = 12.5;
      this.diversificationScore = 3;
      this.overallRisk = 'Medium';
    } else {
      this.recommendations = this.getActiveWalletRecommendations();
      this.estimatedApyBoost = 18.2;
      this.diversificationScore = 7;
      this.overallRisk = 'High';
    }
    
    this.filteredRecommendations = [...this.recommendations];
    this.applyFilters();
  }

  goBack() {
    window.history.back();
  }
  
  copyAddress() {
    navigator.clipboard.writeText(this.walletAddress);
    this.snackBar.open('Address copied to clipboard!', 'Dismiss', {
      duration: 2000,
    });
  }
  
  applyFilters() {
    this.filteredRecommendations = this.recommendations.filter(rec => {
      // Category filter
      const categoryMatch = this.selectedCategory.includes('all') || 
        this.selectedCategory.includes(rec.category?.toLowerCase() || '');
      
      // Risk filter
      const riskMatch = this.selectedRisk.includes('all') || 
        this.selectedRisk.includes(rec.risk_level || '');
      
      return categoryMatch && riskMatch;
    });
    
    // Sort results
    this.sortRecommendations();
  }
  
  sortRecommendations() {
    this.filteredRecommendations.sort((a, b) => {
      if (this.sortBy === 'apy') {
        const apyA = parseFloat(a.apy?.split('-')[0] || '0');
        const apyB = parseFloat(b.apy?.split('-')[0] || '0');
        return apyB - apyA;
      }  else { // tvl
        const tvlA = parseFloat(a.tvl?.replace(/[^0-9.]/g, '') || '0');
        const tvlB = parseFloat(b.tvl?.replace(/[^0-9.]/g, '') || '0');
        return tvlB - tvlA;
      }
    });
  }

  
  getChainIcon(chain?: string): string {
    // In a real app, these would be actual chain icons
    switch(chain?.toLowerCase()) {
      case 'ethereum': return 'https://www.cdnlogo.com/logos/e/81/ethereum-eth.svg';
      case 'arbitrum': return 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdERaTvc4qtd3Oj98EbPvuI5diq9sKRuM2fw&s';
      case 'optimism': return 'https://s2.coinmarketcap.com/static/img/coins/200x200/11840.png';
      case 'polygon': return 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Polygon_Icon.svg/1200px-Polygon_Icon.svg.png';
      default: return 'https://www.cdnlogo.com/logos/e/81/ethereum-eth.svg';
    }
  }
  
  getRiskIcon(risk?: string): string {
    switch(risk) {
      case 'low': return 'shield';
      case 'medium': return 'warning';
      case 'high': return 'dangerous';
      default: return 'help';
    }
  }

  private getColdWalletRecommendations(): Recommendation[] {
    return [
      {
        token_name: 'Uniswap',
        token_photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Uniswap_Logo.svg/1200px-Uniswap_Logo.svg.png',
        token_description: 'Uniswap is a decentralized trading protocol that facilitates automated trading of decentralized finance (DeFi) tokens.',
        apy: '3-10%',
        risk_level: 'medium',
        category: 'DEX',
        tvl: '$3.2B',
        chain: 'Ethereum',
        launch_date: '2018',
        audit_status: 'Audited',
        token_price: '$5.42',
        price_change: '+2.4%'
      },
      {
        token_name: 'Aave',
        token_photo: 'https://res.coinpaper.com/coinpaper/aave_aave_logo_cc5081db13.png',
        token_description: 'Aave is an open-source and non-custodial protocol enabling the creation of money markets.',
        apy: '2-8%',
        risk_level: 'medium',
        category: 'Lending',
        tvl: '$6.5B',
        chain: 'Ethereum',
        launch_date: '2017',
        audit_status: 'Audited',
        token_price: '$87.15',
        price_change: '-1.2%'
      },
      {
        token_name: 'Lido',
        token_photo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSkmWUT2jQscCwF99ajIJ728p7JOvypsv_iOg&s',
        token_description: 'Lido is a liquid staking solution for Ethereum that lets users stake their ETH without locking assets.',
        apy: '4-6%',
        risk_level: 'low',
        category: 'Staking',
        tvl: '$14.2B',
        chain: 'Ethereum',
        launch_date: '2020',
        audit_status: 'Audited',
        token_price: '$1.82',
        price_change: '+5.7%'
      },
      {
        token_name: 'Curve',
        token_photo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgi6GruvYeE2-vs3nWIQrF-34mHkhzeg_W1g&s',
        token_description: 'Curve is an exchange liquidity pool designed for extremely efficient stablecoin trading.',
        apy: '2-15%',
        risk_level: 'medium',
        category: 'Stablecoins',
        tvl: '$2.1B',
        chain: 'Ethereum',
        launch_date: '2020',
        audit_status: 'Audited',
        token_price: '$0.45',
        price_change: '-3.1%'
      },
      {
        token_name: 'Compound',
        token_photo: 'https://s2.coinmarketcap.com/static/img/coins/200x200/5692.png',
        token_description: 'Compound is an algorithmic, autonomous interest rate protocol built for developers.',
        apy: '1-7%',
        risk_level: 'medium',
        category: 'Lending',
        tvl: '$1.8B',
        chain: 'Ethereum',
        launch_date: '2018',
        audit_status: 'Audited',
        token_price: '$54.30',
        price_change: '+0.8%'
      }
    ];
  }

  private getActiveWalletRecommendations(): Recommendation[] {
    return [
      {
        token_name: 'Optimism',
        token_photo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqidBq62tBzMjwxpb9WljM3BuKe6oEHzbJ6Q&s',
        token_description: 'Optimism is a Layer 2 scaling solution for Ethereum that reduces fees and latency.',
        apy: '5-20%',
        risk_level: 'high',
        category: 'Layer 2',
        tvl: '$800M',
        chain: 'Optimism',
        launch_date: '2021',
        audit_status: 'Audited',
        token_price: '$1.75',
        price_change: '+12.4%'
      },
      {
        token_name: 'Rocket Pool',
        token_photo: 'https://raw.githubusercontent.com/rocket-pool/rocketpool/master/images/logo.png?raw=true',
        token_description: 'Rocket Pool is a decentralized Ethereum staking protocol that allows users to stake with as little as 0.01 ETH.',
        apy: '4-6%',
        risk_level: 'low',
        category: 'Staking',
        tvl: '$1.2B',
        chain: 'Ethereum',
        launch_date: '2016',
        audit_status: 'Audited',
        token_price: '$22.40',
        price_change: '-2.1%'
      },
      {
        token_name: 'Arbitrum',
        token_photo: 'https://images.seeklogo.com/logo-png/48/2/arbitrum-arb-logo-png_seeklogo-482927.png',
        token_description: 'Arbitrum is an optimistic rollup that scales Ethereum by moving computation off-chain.',
        apy: '8-25%',
        risk_level: 'high',
        category: 'Layer 2',
        tvl: '$1.5B',
        chain: 'Arbitrum',
        launch_date: '2021',
        audit_status: 'Audited',
        token_price: '$1.10',
        price_change: '+8.7%'
      },
      {
        token_name: 'Convex Finance',
        token_photo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGOrGcC6wPT122xAA7V0J8WIAjXAoWVvG_vw&s',
        token_description: 'Convex simplifies Curve Finance staking to maximize yield with minimal effort.',
        apy: '10-30%',
        risk_level: 'high',
        category: 'Yield',
        tvl: '$2.3B',
        chain: 'Ethereum',
        launch_date: '2021',
        audit_status: 'Audited',
        token_price: '$3.85',
        price_change: '+15.2%'
      },
      {
        token_name: 'Frax Finance',
        token_photo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWz5IlJKjrrr5PChWax85Jpbnr3vKHtHMThA&s',
        token_description: 'Frax is a fractional-algorithmic stablecoin protocol that aims to provide highly scalable money.',
        apy: '5-15%',
        risk_level: 'medium',
        category: 'Stablecoins',
        tvl: '$1.1B',
        chain: 'Ethereum',
        launch_date: '2020',
        audit_status: 'Audited',
        token_price: '$0.99',
        price_change: '+0.1%'
      }
    ];
  }
}