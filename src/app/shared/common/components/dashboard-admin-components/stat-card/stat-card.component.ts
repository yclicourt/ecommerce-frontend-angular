import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stat-card.component.html',
  styleUrl: './stat-card.component.css',
})
export class StatCardComponent {
  @Input() title: string = '';
  @Input() value: string | number = '';
  @Input() icon: string = '';
  @Input() trend: string = '';
  @Input() trendColor: 'green' | 'red' | 'blue' | 'amber' = 'green';

  getIconColor(): string {
    switch (this.icon) {
      case 'dollar':
        return 'blue';
      case 'user':
        return 'pink';
      case 'cart':
        return 'green';
      case 'graph':
        return 'orange';
      default:
        return 'blue';
    }
  }
}
