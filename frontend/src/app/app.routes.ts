import { Routes } from '@angular/router';
import { RecommendationsComponent } from './pages/recommendations.component';
import { HomeComponent } from './pages/home.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'recommendations/:address', component: RecommendationsComponent },
  { path: '**', redirectTo: '' }
];