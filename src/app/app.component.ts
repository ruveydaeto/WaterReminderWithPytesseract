import { Component } from '@angular/core';
import { WaterBottleComponent } from './components/water-bottle/water-bottle.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [WaterBottleComponent], // ← BURASI ÖNEMLİ!
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'su-icme-ui';
}