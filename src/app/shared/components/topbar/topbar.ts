import { Component } from '@angular/core';
import {
  LucideAngularModule,
  Search,
  Bell,
  ChevronDown,
} from 'lucide-angular';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    LucideAngularModule,
  ],
  templateUrl: './topbar.html',
  styleUrl: './topbar.scss',
})
export class NavbarComponent {

  pageTitle = 'Dashboard';

  readonly Search = Search;
  readonly Bell = Bell;
  readonly ChevronDown = ChevronDown;
}