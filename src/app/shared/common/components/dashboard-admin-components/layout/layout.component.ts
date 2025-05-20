import { Component } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';

import { RouterOutlet } from '@angular/router';
import { FooterDashboardComponent } from '../footer/footer.component';
import HeaderDashboardComponent from '../header/header.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    SidebarComponent,
    HeaderDashboardComponent,
    RouterOutlet,
    FooterDashboardComponent,
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
})
export default class LayoutComponent {}
