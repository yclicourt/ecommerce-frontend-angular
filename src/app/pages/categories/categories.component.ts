import { Component } from '@angular/core';
import { HeaderComponent } from '../../shared/common/components/header/header.component';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [HeaderComponent],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css',
})
export default class CategoriesComponent {}
