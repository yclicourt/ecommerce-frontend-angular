import { Component, inject } from '@angular/core';
import { SpinnerService } from '../../services/spinner.service';

@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [],
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.css',
})
export class SpinnerComponent {
  private readonly spinnerSvc = inject(SpinnerService);
  isLoading = this.spinnerSvc.isLoading;
}
