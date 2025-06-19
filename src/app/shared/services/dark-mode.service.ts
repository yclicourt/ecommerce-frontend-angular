import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DarkModeService {


  private darkMode = false;

  constructor() {
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode !== null) {
      this.darkMode = savedMode === 'true';
    } else {
      this.darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    this.applyTheme();
  }

  // Method to handle dark Mode flag
  isDarkMode(): boolean {
    return this.darkMode;
  }

  // Method to handle dark Mode toggle
  toggleDarkMode(): void {
    this.darkMode = !this.darkMode;
    localStorage.setItem('darkMode', this.darkMode.toString());
    this.applyTheme();
  }

  // method to manipulate dom
  private applyTheme(): void {
    if (this.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
}
