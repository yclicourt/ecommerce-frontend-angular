import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {

  isLoading = signal<boolean>(false)

  // Method to hide the spinner
  public hide (){
    this.isLoading.set(false)
  }

  // Method to show the spinner
  public show() {
    this.isLoading.set(true)
  }
}
