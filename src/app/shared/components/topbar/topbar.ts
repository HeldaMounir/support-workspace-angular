import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './topbar.html',
  styleUrl: './topbar.scss'
})
export class NavbarComponent {

  pageTitle = 'Dashboard';

  darkMode = false;

  toggleTheme(): void {
    this.darkMode = !this.darkMode;

    document.body.classList.toggle(
      'dark-theme',
      this.darkMode
    );
  }
}