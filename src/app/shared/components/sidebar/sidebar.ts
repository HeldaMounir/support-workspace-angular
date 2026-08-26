import { Component } from '@angular/core';

import {
  RouterLink,
  RouterLinkActive,
} from '@angular/router';

import {
  LucideAngularModule,
  LayoutDashboard,
  ClipboardList,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-angular';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    LucideAngularModule,
  ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class SidebarComponent {

  collapsed = false;

  readonly LayoutDashboard = LayoutDashboard;
  readonly ClipboardList = ClipboardList;
  readonly Settings = Settings;
  readonly LogOut = LogOut;
  readonly ChevronLeft = ChevronLeft;
  readonly ChevronRight = ChevronRight;

  toggleSidebar(): void {
    this.collapsed = !this.collapsed;
  }
}