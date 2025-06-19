import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SpinnerComponent } from '@components/spinner/spinner.component';
import { DarkModeService } from '@shared/services/dark-mode.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SpinnerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  private darkModeService = inject(DarkModeService);

  constructor() {
    this.darkModeService.isDarkMode();
  }
}
