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
        return 'red';
      case 'cart':
        return 'green';
      case 'graph':
        return 'orange';
      default:
        return 'blue';
    }
  }
  getIconGradient() {
     const gradients = {
      blue: 'bg-gradient-to-tr from-blue-600 to-blue-400 shadow-blue-500/40',
      red: 'bg-gradient-to-tr from-red-600 to-red-400 shadow-red-500/40',
      green: 'bg-gradient-to-tr from-green-600 to-green-400 shadow-green-500/40',
      orange: 'bg-gradient-to-tr from-orange-600 to-orange-400 shadow-orange-500/40'
    };
    return gradients[this.getIconColor() as keyof typeof gradients];
  }
}
